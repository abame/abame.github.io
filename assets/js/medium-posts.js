$(function () {
    const mediumPromise = new Promise(function (resolve) {
    const $content = $('#jsonContent')
    const data = {
        rss: 'https://medium.com/feed/@albionbame'
    }
    const maxLength = 75 // maximum number of characters to extract

    $.get(' https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40albionbame', data, function (response) {
        if (response.status == 'ok') {
            let display = ''
            $.each(response.items, function (k, item) {
                display += `<div class="card col-sm-12 mb-3 mx-auto mr-5 " style="width: 20rem;">`
                display += `<div class="card-body">`
                display += `<h5 class="card-title"><a href="${item.link}">${item.title}</a></h5>`
                display += `<img src="${item["thumbnail"]}" class="card-img-top" alt="Cover image">`
                
                let yourString = item.description.replace(/<img[^>]*>/g,"") //replace with your string.
                yourString = yourString.replace('h4', 'p')
                yourString = yourString.replace('h3', 'p')
 
                //trim the string to the maximum length
                let trimmedString = yourString.substr(0, maxLength)
                //re-trim if we are in the middle of a word
                trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
                display += `<p class="card-text">${trimmedString}...</p>`
                
                display += `<a href="${item.link}" target="_blank" class="btn btn-outline-success" >Read More</a>`
                display += '</div></div>'
 
                return k < 10
            })

            resolve($content.html(display))
        }
    })
})

/*mediumPromise.then(function()
    {
        //Pagination
        pageSize = 1

        const pageCount = $(".card").length / pageSize

        for (let i = 0; i < pageCount; i++) {
            $("#paginaton").append(`<li class="page-item"><a class="page-link" href="#">${(i + 1)}</a></li> `)
        }
        $("#paginaton li:nth-child(1)").addClass("active")
        showPage = function (page) {
            $(".card").hide()
            $(".card").each(function (n) {
                if (n >= pageSize * (page - 1) && n < pageSize * page)
                    $(this).show()
            })
        }

        showPage(1)

        $("#paginaton li").click(function () {
            $("#pagin li").removeClass("active")
            $(this).addClass("active")
            showPage(parseInt($(this).text()))
            return false
        })
    })*/
})