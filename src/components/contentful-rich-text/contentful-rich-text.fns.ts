
/**
 * unescapeHtmlString()
 * 
 * unescapes an html string.
 * @param htmlStr the escaped html string.
 * @returns an unescaped HTML string.
 */

export const unescapeHtmlString = (htmlStr: string): string => {
    htmlStr = htmlStr.replace(/&lt;/g, "<");
    htmlStr = htmlStr.replace(/&gt;/g, ">");
    htmlStr = htmlStr.replace(/&quot;/g, "\"");
    htmlStr = htmlStr.replace(/&#39;/g, "\'");
    htmlStr = htmlStr.replace(/&amp;/g, "&");
    return htmlStr;
}