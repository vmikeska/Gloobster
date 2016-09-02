using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IContentEvaluator
    {
        Task<double> EvaluateArticle(string articleId);
    }
}