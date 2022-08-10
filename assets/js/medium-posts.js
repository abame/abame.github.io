$(function () {
	const mediumPromise = new Promise(function (resolve) {
		const $content = $('#jsonContent')
		const maxLength = 75 // maximum number of characters to extract

		$.get(' https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40albionbame', function (response) {
			if (response.status == 'ok') {
				let display = ''
				display += `<div class="col-sm-12 text-right medium-link">
						<a href="https://albionbame.medium.com/" target="_blank">${response.feed.title}</a> |
						<a class="subscribe" href="https://albionbame.medium.com/subscribe" target="_blank">Subscribe</a> |
						<a class="rss" href="${response.feed.url}" target="_blank">RSS Feed</a>
				</div>`

				for (const item of response.items) {
					let description = item.description
						.replace(/<img[^>]*>/g,"")
						.replace('h4', 'p')
						.replace('h3', 'p')
						.substr(0, maxLength)

					//re-trim if we are in the middle of a word
					description = description.substr(
						0,
						Math.min(description.length, description.lastIndexOf(" "))
					)

					display += `<div class="card col-sm-12 mb-3 mx-auto mr-5 " style="width: 20rem;">
												<div class="card-body">
													<h5 class="card-title"><a href="${item.link}">${item.title}</a></h5>
													<img src="${item["thumbnail"]}" class="card-img-top" alt="Cover image">
													<p class="card-text">${description}...</p>
													<a href="${item.link}" target="_blank" class="btn btn-outline-success" >Read More</a>
												</div>
											</div>`
				}

				resolve($content.html(display))
			}
		})
	})

/*mediumPromise.then(function() {
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