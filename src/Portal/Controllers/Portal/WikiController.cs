using System.Collections.Generic;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.DomainModels.Wiki;
using Gloobster.Portal.Controllers.Api.Wiki;

namespace Gloobster.Portal.Controllers.Portal
{
    public class WikiController : PortalBaseController
    {
        public IFilesDomain FileDomain { get; set; }
        public IWikiPermissions WikiPerms { get; set; }

        public WikiController(IWikiPermissions wikiPerms, IFilesDomain filesDomain, ILogger log,  IDbOperations db, IComponentContext cc) : base(log, db, cc)
        {
            FileDomain = filesDomain;
            WikiPerms = wikiPerms;
        }

        [CreateAccount]
        public IActionResult Home()
        {
            var vm = CreateViewModelInstance<WikiHomeViewModel>();

            return View(vm);
        }

        [CreateAccount]
        public IActionResult PageRegular(string id, string lang)
        {
            WikiModelBase vm = null;
            string template = string.Empty;
            var text = DB.C<WikiTextsEntity>().FirstOrDefault(i => i.LinkName == id && i.Language == lang);

            if (text == null)
            {
                return HttpNotFound();
            }

            if (text.Type == ArticleType.Country)
            {
                vm = GetCountryVM(text);
                template = "Country";                
            }
            if (text.Type == ArticleType.City)
            {
                vm = GetCityVM(text);
                template = "City";
            }

            if (string.IsNullOrEmpty(vm.TitleLink))
            {
                vm.TitleLink = "/images/samples/sample16.jpg";
            }
            
            vm.IsAdmin = IsUserLogged && WikiPerms.HasArticleAdminPermissions(UserId, text.Article_id.ToString());
            vm.ArticleId = text.Article_id.ToString();

            var langVers = DB.C<WikiTextsEntity>()
                .Where(i => i.Article_id == text.Article_id)
                .Select(a => new {a.Language, a.LinkName})
                .ToList();

            vm.LangVersions = 
                langVers.Select(i => new LangVersionVM {Language = i.Language, LinkName = i.LinkName}).ToList();
            
            return View(template, vm);
        }

        [CreateAccount]
        public IActionResult Page(string id)
        {
            var texts = DB.C<WikiTextsEntity>().Where(i => i.LinkName == id).ToList();

            if (texts.Count == 0)
            {
                return HttpNotFound();
            }

            WikiTextsEntity englishText = texts.FirstOrDefault(i => i.Language == "en");
            var selectedText = englishText ?? texts.First();

            var url = $"/wiki/{selectedText.Language}/{selectedText.LinkName}";
            return RedirectPermanent(url);
        }
        
        public IActionResult ArticlePhotos(string id, bool admin)
        {
            var articleIdObj = new ObjectId(id);

            var city = DB.FOD<WikiCityEntity>(c => c.id == articleIdObj);
            var photos = admin ? city.Photos : city.Photos.Where(p => p.Confirmed).ToList();
            
            var vm = new PhotosVM
            {
                Photos = WikiCityViewModel.ConvertPhotos(photos, DB),
                ArticleId = city.id.ToString(),
                Admin = admin,
                UserIsAdmin = true
            };
            return View(vm);
        }


        public IActionResult LinkMap()
        {
            var vm = CreateViewModelInstance<WikiLinkMapViewModel>();

            var continents = DB.C<WikiContinentEntity>().ToList();
            var countries = DB.C<WikiCountryEntity>().ToList();
            var cities = DB.C<WikiCityEntity>().ToList();

            vm.Languages = new List<WikiLanguageVM>
            {
                GetLanguageEntries("en", countries, cities, continents)
            };

            return View(vm);
        }



        public IActionResult ArticleTitlePhoto(string id)
        {
            var stream = GetPicture(id, WikiFileConstants.TitlePhotoNameExt);
            return stream;
        }

        public IActionResult ArticlePhoto(string photoId, string articleId)
        {
            var name = $"{photoId}.jpg";
            var stream = GetPicture(articleId, name, WikiFileConstants.GalleryDir);
            return stream;
        }

        public IActionResult ArticlePhotoThumb(string photoId, string articleId)
        {
            var name = $"{photoId}_thumb.jpg";
            var stream = GetPicture(articleId, name, WikiFileConstants.GalleryDir);
            return stream;
        }


        [AuthorizeWeb]
        public IActionResult Permissions()
        {
            var perms = DB.List<WikiPermissionEntity>();

            bool masterAdmin = perms.Any(u => u.IsMasterAdmin && u.User_id == UserIdObj.Value);
            bool superAdmin = perms.Any(u => u.IsSuperAdmin && u.User_id == UserIdObj.Value);
            if (!masterAdmin && !superAdmin)
            {
                return HttpUnauthorized();
            }

            var userIds = perms.Select(u => u.User_id).ToList();
            var users = DB.List<UserEntity>(u => userIds.Contains(u.User_id));

            var vm = CreateViewModelInstance<WikiPermissionsViewModel>();
            vm.IsMasterAdmin = masterAdmin;
            vm.IsSuperAdmin = superAdmin;

            vm.MasterAdmins = perms
                .Where(u => u.IsMasterAdmin)
                .ToList()
                .Select(i => ConvertUser(users, i.User_id))
                .ToList();

            vm.SuperAdmins = perms
                .Where(u => u.IsSuperAdmin)
                .ToList()
                .Select(i => ConvertUser(users, i.User_id))
                .ToList();

            var unrichAdmins = perms.Where(u => !u.IsSuperAdmin && !u.IsMasterAdmin).ToList();
            var involvedArticlesIds = unrichAdmins.SelectMany(a => a.Articles).ToList();
            var involvedArticles = DB.List<WikiTextsEntity>(a => involvedArticlesIds.Contains(a.Article_id));

            vm.Users = unrichAdmins.Select(i => new UserPermVM
            {
                UserId = i.User_id.ToString(),
                Name = users.First(u => u.User_id == i.User_id).DisplayName,
                Items = i.Articles.Select(a => ConvertArticle(involvedArticles, a)).ToList()
            }).ToList();

            return View(vm);
        }



        private WikiCityViewModel GetCityVM(WikiTextsEntity text)
        {
            var article = DB.C<WikiCityEntity>().FirstOrDefault(i => i.id == text.Article_id);

            var vm = CreateViewModelInstance<WikiCityViewModel>();
            vm.Texts = text;
            vm.Article = article;

            if (vm.Article.HasTitlePhoto)
            {
                vm.TitleLink = $"/wiki/ArticleTitlePhoto/{vm.Article.id}";
            }

            return vm;
        }

        private WikiCountryViewModel GetCountryVM(WikiTextsEntity text)
        {
            var article = DB.C<WikiCountryEntity>().FirstOrDefault(i => i.id == text.Article_id);
            
            var vm = CreateViewModelInstance<WikiCountryViewModel>();
            vm.Texts = text;
            vm.Article = article;

            var gidDataItem = article.Data.FirstOrDefault(a => a.Name == "CapitalId");
            if (gidDataItem != null)
            {
                int cityGID = int.Parse(gidDataItem.Value);
                var city = DB.C<WikiCityEntity>().FirstOrDefault(c => c.GID == cityGID);
                if (city != null && city.HasTitlePhoto)
                {
                    vm.TitleLink = $"/wiki/ArticleTitlePhoto/{city.id}";
                }
            }
            
            return vm;
        }
        
        private FileStreamResult GetPicture(string articleId, string picName, string customDir = null)
        {
            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);
            var finalDir = articleDir;
            
            if (!string.IsNullOrEmpty(customDir))
            {
                finalDir = FileDomain.Storage.Combine(articleDir, customDir);
            }
            
            var filePath = FileDomain.Storage.Combine(finalDir, picName);
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(finalDir, picName);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
        }
        
        private WikiLanguageVM GetLanguageEntries(string language, List<WikiCountryEntity> countriesE, 
            List<WikiCityEntity> citiesE, List<WikiContinentEntity> continents)
        {
            var langs = DB.C<WikiTextsEntity>().Where(c => c.Language == language).ToList();
            var texts = langs.Select(i => new WikiLinkVM
            {
                Id = i.Article_id.ToString(),
                Title = i.Title,
                Link = i.LinkName
            }).ToList();

            var langItem = new WikiLanguageVM
            {
                Language = language,                
                Countries = new List<WikiCountryVM>(),
                Continents = texts.Where(i => continents.Select(c => c.id.ToString()).Contains(i.Id)).ToList()
            };

            foreach (var countryE in countriesE)
            {
                var countryCities = citiesE.Where(c => c.CountryCode == countryE.CountryCode).ToList();

                var countryLink = new WikiCountryVM
                {
                    Cities = new List<WikiLinkVM>(),
                    Country = texts.First(i => i.Id == countryE.id.ToString())
                };

                foreach (var countryCity in countryCities)
                {
                    var lng = texts.First(i => i.Id == countryCity.id.ToString());
                    countryLink.Cities.Add(lng);
                }

                langItem.Countries.Add(countryLink);
            }

            return langItem;
        }
        
        private PermItemVM ConvertArticle(List<WikiTextsEntity> involvedArticles, ObjectId articleId)
        {
            var article = involvedArticles.FirstOrDefault(a => a.Article_id == articleId && a.Language == "en");

            return new PermItemVM
            {
                WikiId = article.Article_id.ToString(),
                Name = article.Title
            };
        }

        private UserViewModel ConvertUser(List<UserEntity> users, ObjectId userId)
        {
            var user = users.FirstOrDefault(u => u.User_id == userId);

            return new UserViewModel
            {
                Id = user.User_id.ToString(),
                Name = user.DisplayName
            };
        }
        
    }
}