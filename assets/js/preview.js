$(async function () {
    const location = window.location.href;
    const params = new URLSearchParams(window.location.search);
    if(!location.includes('preview') || params.get('slug') === null || params.get('spaceId') === null || params.get('token') === null) {
        return;
    }

    //get article
    const articleResult = await $.get(`https://preview.contentful.com/spaces/${params.get('spaceId')}/entries?content_type=${params.get('contentType')}&fields.slug=${params.get('slug')}&access_token=${params.get('token')}`);
    const article = articleResult.items.splice(-1);
    if(article.length !== 1) {
        return;
    }
    console.log(article);

    //visualise article details
    const createdAt = new Date(article[0].sys.createdAt);
    const month = createdAt.toLocaleString('default', { month: 'long' });
    const headerBackgroundImageId = article[0].fields.headerBackgroundImage.sys.id;
    $("div.page-heading > h1").html(article[0].fields.title);
    $("div.page-heading").append(`<span class="meta">Posted on ${month} ${createdAt.getDate()}, ${createdAt.getFullYear()}</span>`);
    $('article.post-preview').html(documentToHtmlString(article[0].fields.description));

    //get and visualise background image
    const headerBackgroundImage = await $.get(`https://preview.contentful.com/spaces/${params.get('spaceId')}/environments/master/assets/${headerBackgroundImageId}?access_token=${params.get('token')}`);
    $('header.masthead').css('background', `url('${headerBackgroundImage.fields.file.url.replace('//', 'https://')}') 0% 0% / 100% 100% no-repeat`);
});
