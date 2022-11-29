const title = window.location.href.split('/').at(-1)

if (title.length !== 0 && !window.location.href.includes('preview') && !window.location.href.includes('medium')) {
    const postContainer = $('div.single-post')
    postContainer.append(`<article class="post-preview">${documentToHtmlString(postContainer.data('content'))}</article>`)
}
