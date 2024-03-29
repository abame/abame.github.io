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

    const groupedQuestionsAnswers = article[0].fields.questionsAnswers !== undefined ? article[0].fields.questionsAnswers.reduce(
        (result, item) => ({
        ...result,
        [item["group"]]: [
            ...(result[item["group"]] || []),
            item,
        ],
        }), 
        {},
    ) : [];

    //visualise article details
    const createdAt = new Date(article[0].sys.createdAt);
    const month = createdAt.toLocaleString('default', { month: 'long' });
    const headerBackgroundImageId = article[0].fields.headerBackgroundImage?.sys.id;
    $(".masthead .page-heading > h1").remove();
    //$("div.page-heading > h1").html(article[0].fields.title);
    $(".page-title div.page-heading").append(`
        <h1>
            <span>${article[0].fields.title}</span>
            <span class="meta">Posted on ${month} ${createdAt.getDate()}, ${createdAt.getFullYear()}</span>
        </h1>
        <a href="https://bellard.org/jslinux/vm.html?cpu=riscv64&url=fedora33-riscv.cfg&mem=256" target="_blank">Terminal</a>
    `);
    let html = "";
    if(article[0].fields.description !== undefined) {
        html += (await documentToHtmlString(article[0].fields.description)).replace(/\n/g,'</br>');
    }

    for (const group in groupedQuestionsAnswers) {
        html += `<div id="title-container"><div class="head"><h2>${group}</h2><i class="fas fa-angle-down arrow"></i></div>`;
        html += `<div class="content">`;
        for (const [index, questionAnswer] of groupedQuestionsAnswers[group].entries()) {
            html += `<div class="exercise-${index}"><p style="font-weight: bold;">Exercise ${index + 1}: <a class="showAnswer ${questionAnswer.answer ? "" : "hidden"}" href="javascript:;">Answer</a></p>`;
            html += `<p>${questionAnswer.question}</p>`;
            if (questionAnswer.answer) {
                html += `<div class="customInfobox"><div class="title">${questionAnswer.answer}</div></div>`;
            }
            html += "</div>";
        }
        html += "</div></div>";
    }
    $('article.post-preview').html(html);

    //get and visualise background image
    if (headerBackgroundImageId) {
        const headerBackgroundImage = await $.get(`https://preview.contentful.com/spaces/${params.get('spaceId')}/environments/master/assets/${headerBackgroundImageId}?access_token=${params.get('token')}`);
        $('header.masthead').css('background', `url('${headerBackgroundImage.fields.file.url.replace('//', 'https://')}') 0% 0% / 100% 100% no-repeat`);
    }
    hljs.highlightAll();
});

$(document).on("click", "div.head" , function() {
    $(this).toggleClass('active');
    $(this).parent().find('.arrow').toggleClass('arrow-animate');
    $(this).parent().find('.content').slideToggle(280);
});

$(document).on("click", "a.showAnswer" , function() {
    $(this).parent().nextAll("div.customInfobox").first().slideToggle(280);
});
hljs.highlightAll();