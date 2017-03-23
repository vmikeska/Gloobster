using System;
using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using Gloobster.Database;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    
    public class LinkVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<LinkItemSE> Links { get; set; }
    }

    public class TableItemVM
    {        
        public bool? Liked1 { get; set; }
        //public bool? Liked3 { get; set; }
        //public bool? Liked2 { get; set; }

        public string Id1 { get; set; }
        //public string Id2 { get; set; }
        //public string Id3 { get; set; }
        public string Name { get; set; }
        public decimal Price1 { get; set; }
        //public decimal Price2 { get; set; }
        //public decimal Price3 { get; set; }
    }

    public class DoDontsVM
    {
        public List<DdVM> Dos { get; set; }
        public List<DdVM> Donts { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class EmptyVM
    {
        public object Data { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class DdVM
    {
        public string Id { get; set; }
        public string Text { get; set; }

        public bool? Liked { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class PVM
    {
        public bool? Liked { get; set; }

        public ViewModelBase B { get; set; }
    }

    public class LangVersionVM
    {
        public string Language { get; set; }
        public string LinkName { get; set; }
    }

    public class Breadcrumb
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
    }

    public class RelatedLink
    {
        public string Name { get; set; }
        public string Link { get; set; }
    }

    public class InfoItemVM
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string TranslatedName { get; set; }
        public string AfterName { get; set; }
        public string Value { get; set; }
        public bool Show { get; set; }
        public string ListCategory { get; set; }
    }

    public class PriceItemVM
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public decimal Price { get; set; }
    }

    //todo: used ?
    public static class ListExtensions
    {
        public static List<List<T>> SplitBy<T>(this List<T> source, int count)
        {
            return source
                .Select((x, i) => new { Index = i, Value = x })
                .GroupBy(x => x.Index / count)
                .Select(x => x.Select(v => v.Value).ToList())
                .ToList();
        }
    }


}