const client = contentful.createClient({
    space: `${CONTENTFUL_SPACE_ID}`,
    accessToken: `${CONTENTFUL_SECRET}`
});

const pageTitle = $('div[data-title]')

if (['homepage', 'posts'].includes(pageTitle.data('title'))) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const postsContainer = $('div.posts')

    const filters = {content_type: 'blogPost'}
    if (pageTitle.data('title') === 'homepage') {
        filters.limit = 3
    }

    if (typeof params.title === "undefined") {
        client.getEntries(filters).then((entries) => {
            if (entries.items.length < 3) {
                $('div.view-all-posts').hide()
            }
            entries.items.forEach(function (entry) {
                const createdAt = new Date(entry.sys.createdAt)

                let article = '<article class="post-preview">'
                article += `<a href="/posts?title=${entry.fields.slug}">`
                article += `<h2 class="post-title">${entry.fields.title}</h2>`
                article += '</a>'
                article += `<p class="post-meta">Posted on ${createdAt.toLocaleString('default', {month: 'long'})} ${createdAt.getDate()}, ${createdAt.getYear()}</p>`
                article += '</article><hr/>'
                postsContainer.prepend(article)
            });
        });
    } else {
        client.getEntries({
            content_type: 'blogPost',
            'fields.slug[match]': params.title,
        }).then((entries) => {
            const post = entries.items[0]
            if (typeof post === "undefined") {
                postsContainer.prepend('<h2 class="alert alert-danger text-center">No Post Found</h2>')
            } else {
                const createdAt = new Date(post.sys.createdAt)

                const title = $('title')
                title.text(title.text().replace('Posts', post.fields.title))

                $('div.page-heading').append(`<span className="subheading">${post.fields.title}</span>`)

                let article = '<article class="post-preview">'
                article += `<p class="post-meta text-right">Posted on ${createdAt.toLocaleString('default', {month: 'long'})} ${createdAt.getDate()}, ${createdAt.getYear()}</p><hr/>`
                article += documentToHtmlString(post.fields.description)
                article += '</article>'

                postsContainer.append(article)
            }
        })
    }
}
