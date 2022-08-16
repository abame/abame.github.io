const title = window.location.href.split('/').at(-1)

if (title.length !== 0) {
    const postContainer = $('div.single-post')
    postContainer.append(`<article class="post-preview">${documentToHtmlString(postContainer.data('content'))}</article>`)
}
