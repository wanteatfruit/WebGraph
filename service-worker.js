let currentUrl = "";
let data = [];

chrome.tabs.onCreated.addListener(function (tab) {
  console.log(tab.pendingUrl);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" && tab.url !== currentUrl) {
    if (tab.url === "chrome://newtab/") {
      console.log("new tab");
      return;
    }
    console.log(tab);
    console.log(`${currentUrl} -> ${tab.url}`);
    data.push({
      source: currentUrl,
      target: tab.url,
      type: new URL(tab.url).hostname,
    });
    console.log(data);
    // chrome.storage.session.set({ currentUrl: tab.url }).then(() => {
    //   console.log("Value was set");
    // });
    // chrome.storage.session.get(null).then((result) => {
    //     console.log(result);
    //   });

    currentUrl = tab.url;
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    console.log(tab);
    currentUrl = tab.url;
  });
});
