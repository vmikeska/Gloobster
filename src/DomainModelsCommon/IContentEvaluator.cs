using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IContentEvaluator
    {
        Task<decimal> EvaluateArticle(string articleId);
    }
}