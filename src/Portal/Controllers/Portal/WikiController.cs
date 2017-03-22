﻿using System.Collections.Generic;
using System.Drawing;
using System.IO;
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
using Gloobster.Common;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities.ImageDB;
using Gloobster.Portal.Controllers.Api.Wiki;


namespace Gloobster.Portal.Controllers.Portal
{
    public class WikiController : PortalBaseController
    {
        public IFilesDomain FileDomain { get; set; }
        public IWikiPermissions WikiPerms { get; set; }

        public WikiController(IWikiPermissions wikiPerms, IFilesDomain filesDomain, ILogger log, IDbOperations db, 
            IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            FileDomain = filesDomain;
            WikiPerms = wikiPerms;
        }
        
        [CreateAccount]
        public IActionResult Home()
        {
            var vm = CreateViewModelInstance<WikiHomeViewModel>();
            vm.DefaultLangModuleName = "pageWikiHome";
            vm.LoadClientTexts(new[] { "jsWiki" });

            vm.LoadArticles();
            
            return View(vm);
        }


        [CreateAccount]
        public IActionResult PageRegular(string id, string lang)
        {            
            NewWikiModelBase vm = null;
            string template = string.Empty;
            var text = DB.FOD<WikiTextsEntity>(i => i.LinkName == id && i.Language == lang);

            if (text == null)
            {
                return HttpNotFound();
            }

            if (text.Type == ArticleType.Country)
            {
                vm = GetCountryVM(text);
                template = "AACity";
            }

            if (text.Type == ArticleType.City)
            {
                vm = GetCityVM(text);
                template = "AACity";
            }

            vm.LoadSections();
            
            //if (string.IsNullOrEmpty(vm.TitleLink))
            //{
            //    vm.TitleLink = "/images/WikiDefault.jpg";
            //}

            vm.IsAdmin = IsUserLogged && WikiPerms.HasArticleAdminPermissions(UserId, text.Article_id.ToString());
            vm.ArticleId = text.Article_id.ToString();

            //var langVers = DB.C<WikiTextsEntity>()
            //    .Where(i => i.Article_id == text.Article_id)
            //    .Select(a => new { a.Language, a.LinkName })
            //    .ToList();

            //vm.LangVersions =
            //    langVers.Select(i => new LangVersionVM { Language = i.Language, LinkName = i.LinkName }).ToList();

            vm.LoadClientTexts(new[] { "jsWiki" });

            return View(template, vm);            
        }
        
        private NewWikiCityViewModel GetCityVM(WikiTextsEntity text)
        {
            var article = DB.FOD<WikiCityEntity>(i => i.id == text.Article_id);

            var vm = CreateViewModelInstance<NewWikiCityViewModel>();
            vm.DefaultLangModuleName = "pageWikiPage";                        
            vm.Texts = text;
            vm.Sections = article.Sections;
            vm.Dos = article.Dos;
            vm.Donts = article.Donts;

            vm.Prices = article.Prices;

            vm.ArticleId = article.id.ToString();

            vm.CountryCode = article.CountryCode;

            vm.Data = article.Data;

            vm.Photos = article.Photos;

            vm.PlacesLinks = article.PlacesLinks;

            //if (vm.Article.HasTitlePhoto)
            //{
            //    vm.TitleLink = $"/wiki/ArticleTitlePhoto/{vm.Article.id}";
            //}
            //else
            //{
            var imgCityEntity = DB.FOD<ImageCityEntity>(c => c.GID == article.GID);
            if (imgCityEntity != null)
            {
                vm.TitleLink = $"/picd/{article.GID}/wtn";
            }
            //}
            
            return vm;
        }

        private NewWikiCountryViewModel GetCountryVM(WikiTextsEntity text)
        {
            var article = DB.FOD<WikiCountryEntity>(i => i.id == text.Article_id);

            var vm = CreateViewModelInstance<NewWikiCountryViewModel>();
            vm.DefaultLangModuleName = "pageWikiPage";
            vm.Texts = text;
            vm.CountryCode = article.CountryCode;

            vm.Dos = article.Dos;
            vm.Donts = article.Donts;

            vm.Sections = article.Sections;
            vm.Data = article.Data;

            vm.ArticleId = article.id.ToString();

            vm.Photos = article.Photos;

            var gidDataItem = article.Data.FirstOrDefault(a => a.Name == "CapitalId");
            if (gidDataItem != null)
            {
                int cityGID = int.Parse(gidDataItem.Value);
                //var city = DB.FOD<WikiCityEntity>(c => c.GID == cityGID);

                //if (city != null && city.HasTitlePhoto)
                //{
                //    vm.TitleLink = $"/wiki/ArticleTitlePhoto/{city.id}";
                //}
                //else
                //{
                var imgCityEntity = DB.FOD<ImageCityEntity>(c => c.GID == cityGID);
                if (imgCityEntity != null)
                {
                    vm.TitleLink = $"/picd/{cityGID}/wtn";
                }
                //}
            }

            return vm;
        }



        [CreateAccount]
        public IActionResult Page(string id)
        {
            var texts = DB.List<WikiTextsEntity>(i => i.LinkName == id);

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

            var continents = DB.List<WikiContinentEntity>();
            var countries = DB.List<WikiCountryEntity>();
            var cities = DB.List<WikiCityEntity>();

            vm.Languages = new List<WikiLanguageVM>
            {
                GetLanguageEntries("en", countries, cities, continents)
            };

            return View(vm);
        }



        public IActionResult ArticleTitlePhoto(string id)
        {
            var stream = GetPicture(id, WikiFileConstants.TitlePhotoNameExt, "full");
            return stream;
        }

        public IActionResult ArticlePhoto(string photoId, string articleId)
        {
            var name = $"{photoId}.jpg";
            var stream = GetPicture(articleId, name, "full", WikiFileConstants.GalleryDir);
            return stream;
        }

        public IActionResult SectionPhoto(string photoId, string articleId)
        {
            var name = $"{photoId}.jpg";
            var stream = GetPicture(articleId, name, "section", WikiFileConstants.GalleryDir);
            return stream;
        }

        //todo: what to do with thumbs?
        //public IActionResult ArticlePhotoThumb(string photoId, string articleId)
        //{
        //    var name = $"{photoId}_thumb.jpg";
        //    var stream = GetPicture(articleId, name, WikiFileConstants.GalleryDir);
        //    return stream;
        //}

        private FileStreamResult GetPicture(string articleId, string picName, string size, string customDir = null)
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

                if (size == "section")
                {
                    var fileStream = FileDomain.GetFile(finalDir, picName);
                    var sizedFileStream = GeneratePic(fileStream, 980, 450);
                    return new FileStreamResult(sizedFileStream, "image/jpeg");                    
                }

                if (size == "full")
                {
                    var fileStream = FileDomain.GetFile(finalDir, picName);
                    return new FileStreamResult(fileStream, "image/jpeg");
                }                
            }

            return null;
        }

        private Stream GeneratePic(Stream origFileStream, int newWidth, int newHeight)
        {
            Bitmap origBitmap = new Bitmap(origFileStream);

            float rateWidth = 1.0f;
            float rateHeight = ((float)newHeight) / ((float)newWidth);


            var rect = BitmapUtils.CalculateBestImgCut(origBitmap.Width, origBitmap.Height, rateWidth, rateHeight);
            var cutBmp = BitmapUtils.ExportPartOfBitmap(origBitmap, rect);
            var newBmp = BitmapUtils.ResizeImage(cutBmp, newWidth, newHeight);
            var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);

            jpgStream.Position = 0;

            cutBmp.Dispose();
            newBmp.Dispose();

            return jpgStream;
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
        
    }
}