// ==UserScript==
// @name         Trello Attach Cards
// @description  Parse description contents, attach cards those urls are mentioned in the contents
// @version      0.1
// @author       Hikerpig
// @copyright    2019 hikerpig (https://openuserjs.org/users/hikerpig)
// @licence      MIT
// @match        https://trello.com/c/*
// @match        https://trello.com/b/*
// @grant        none
// ==/UserScript==

;(function() {
  'use strict'

  const TRELLO_CARD_LINK_PATTERN = /\/c\/([\d\w]+)\//

  /**
   * @type MutationObserver
   */
  let mo

  let autoAttachBtn

  function processDesc() {
    const desc = document.querySelector('.js-desc')
    if (!desc) return
    const cardLinks = []
    desc.querySelectorAll('a').forEach((ele) => {
      const href = ele.href
      const matches = TRELLO_CARD_LINK_PATTERN.test(href)
      if (matches) {
        cardLinks.push({ href })
      }
    })

    if (autoAttachBtn) {
      autoAttachBtn.remove()
      autoAttachBtn = null
    }

    if (cardLinks.length) {
      const attachBtn = document.querySelector('.button-link.js-attach')
      if (attachBtn) {
        autoAttachBtn = document.createElement('div')
        autoAttachBtn.classList.add(['button-link'])
        autoAttachBtn.textContent = 'Auto Attach Cards'
        attachBtn.parentElement.appendChild(autoAttachBtn)

        autoAttachBtn.onclick = function() {
          attachLinks(cardLinks)
        }
      }
    }
  }

  function attachLinks(cardLinks) {
    let curLinkIndex = 0
    const curAttachHrefs = []
    document.querySelectorAll('.trello-card-attachment').forEach((ele) => {
      const firstA = ele.querySelector('a')
      if (firstA) {
        curAttachHrefs.push(firstA.href)
      }
    })

    const hrefs = cardLinks.map(o => o.href).filter((href) => {
      return curAttachHrefs.indexOf(href) < 0
    })

    function attachNextLink() {
      if (!hrefs[curLinkIndex]) return
      setTimeout(() => {
        const attachBtn = document.querySelector('.button-link.js-attach')
        attachBtn.click()

        setTimeout(() => {
          const addLinkInput = document.getElementById('addLink')
          addLinkInput.value = hrefs[curLinkIndex]
          const attachSubmitBtn = document.querySelector('.js-add-attachment-url')
          attachSubmitBtn.click()
          curLinkIndex++

          setTimeout(() => {
            attachNextLink()
          }, 200)

        }, 500);
      }, 100);
    }
    attachNextLink()
  }

  function bindOverlayEvents() {
    const tabParentEle = document.querySelector('.js-tab-parent')
    if (!mo) {
      mo = new MutationObserver(mutations => {
        let hasCardDetail = false
        mutations.forEach(m => {
          if (m.addedNodes.length) {
            hasCardDetail = true
          }
        })

        if (hasCardDetail) {
          processDesc()
        }
      })
    }
    mo.observe(tabParentEle, { childList: true })
  }

  // ---------------- start -----------------------
  processDesc()
  bindOverlayEvents()
})()
