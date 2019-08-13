// ==UserScript==
// @name         Trello Generate Release
// @description  Generate release request content, based on a list's cards
// @version      0.1
// @author       Hikerpig
// @copyright    2019 hikerpig (https://github.com/hikerpig)
// @licence      MIT
// @match        https://trello.com/b/*
// @require      https://unpkg.com/zepto@1.1.0/dist/zepto.js
// @grant        none
// ==/UserScript==

;(function() {
  "use strict"

  let $lists

  function refreshLists() {
    $lists = $(".js-list")
  }

  function insertHelpers() {
    $lists.each((i, item) => {
      const $newButton = $("<a>")
        .text("Generate Release Content")
        .on("click", e => {
          const $list = $(e.target).closest(".js-list")
          genNoteForList($list)
        })
      const $newElement = $("<div>")
        .addClass("helper-button")
        .attr('style', 'padding: 5px 10px; cursor: pointer;')
        .append($newButton)
      $(item)
        .find(".js-list-content")
        .append($newElement)
    })
  }

  function genNoteForList($list) {
    const hrefs = []
    const $cardTitleEles = $list.find(".list-card")
    $cardTitleEles.each((i, ele) => {
      hrefs.push(ele.getAttribute("href"))
    })
    hrefs.reverse()

    var relatedContent = hrefs
      .map(function(href) {
        var str = decodeURIComponent(href)
        return "- https://trello.com" + str
      })
      .join("\n")

    const note = `
## Related
${relatedContent}

## Commits

- 前端: master - ()
`
    console.log(note)
  }

  function initialCheck(repeatTimes) {
    refreshLists()
    if ($lists.length > 0) {
      insertHelpers()
    } else {
      if (repeatTimes > 0) {
        setTimeout(() => {
          initialCheck(--repeatTimes)
        }, 400)
      }
    }
  }

  // ---------------- start -----------------------
  initialCheck(4)
})()
