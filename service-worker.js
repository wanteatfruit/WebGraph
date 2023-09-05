chrome.tabs.onCreated.addListener(function (tab) {
  console.log(tab.pendingUrl);
});

let currentUrl = "chrome://newtab/";
let currentTitle = "New Tab";

//store currenturl and currenttitle
// chrome.storage.sync.set(
//   { currentUrl: "chrome://newtab/", currentTitle: "New Tab" },
//   function () {}
// );

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.url !== currentUrl) {
    if (tab.url === "chrome://newtab/") {
      console.log("new tab");
      return;
    }
    // console.log(tab);
    const newUrl = tab.url;
    const newTitle = tab.title;

    // chrome.storage.sync.get("currentUrl").then((result) => {
    //   console.log(result);
    //   currentUrl = result.currentUrl;
    // });
    // chrome.storage.sync.get("currentTitle").then((result) => {
    //   console.log(result);
    //   currentTitle = result.currentTitle;
    // });

    console.log(`${currentUrl} -> ${tab.url}`);


    if (currentUrl === "" || currentTitle === "") {
      return;
    }
    chrome.storage.session.get("data").then((result) => {
      console.log(result);
      if (result.data === undefined) {
        chrome.storage.session.set(
          {
            data: [
              {
                source: currentTitle,
                target: newTitle,
                sourceUrl: currentUrl,
                targetUrl: newUrl,
                type: new URL(tab.url).hostname,
              },
            ],
          },
          function () {}
        );
      } else {
        let data = result.data;
        console.log(currentUrl);
        data.push({
          source: currentTitle,
          target: newTitle,
          sourceUrl: currentUrl,
          targetUrl: newUrl,
          type: new URL(tab.url).hostname,
        });
        chrome.storage.session.set({ data: data }).then(() => {
          console.log("Value was set");
        });
      }
      currentUrl = tab.url;
      currentTitle = tab.title;
      chrome.storage.session.set(
        { currentUrl: tab.url, currentTitle: tab.title },
        function () {
          console.log("Value is set to " + currentUrl);
        }
      );
    });
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    // check if current url is empty

    currentUrl = tab.url;
    currentTitle = tab.title;
    // chrome.storage.sync.set(
    //   { currentUrl: tab.url, currentTitle: tab.title },
    //   function () {
    //     console.log("Value is set to " + tab.url);
    //   }
    // );
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "GET") {
    chrome.storage.session.get("data").then((result) => {
      console.log(result);
      sendResponse({ data: result.data });
    });
  }
  return true;
});

function reduceTitleLength(title) {
  if (title.length > 20) {
    return title.substring(0, 20) + "...";
  }
  return title;
}
