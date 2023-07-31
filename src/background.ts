import Browser from "webextension-polyfill";

function ArchiveBookmark(title: string, url: string) {
  Browser.notifications.create("ARCHIVE_BOOKMARK", {
    type: "basic",
    iconUrl: "/logo426.png",
    title: Browser.i18n.getMessage("archiveBookmarkNotificationTitle") + title,
    priority: 2,
    message: Browser.i18n.getMessage("archiveBookmarkNotificationMessage"),
  });

  const postLink = "https://web.archive.org/save/" + url;

  fetch(postLink).then((response) => {
    if (response.ok) {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title: "成功归档一个书签：" + title,
        priority: 2,
        message: "你可以无忧的继续浏览互联网！",
      });
    } else if (response.status === 429) {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title: "受到速率限制，暂无法归档 1 个书签：" + title,
        priority: 2,
        message: "插件将在 5 分钟后重试归档操作",
      });

      setTimeout(() => {
        ArchiveBookmark(title, url);
      }, 300000);
    } else if (response.status === 523) {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title: "归档失败，服务器报告“" + title + "”无法访问",
        priority: 2,
        message: "请检查你的书签地址是否正确，然后重试",
      });
    } else {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title: "归档失败，未知错误：" + response.status,
        priority: 2,
        message: "插件将在 5 分钟后重试归档操作",
      });

      console.log(response);

      setTimeout(() => {
        ArchiveBookmark(title, url);
      }, 300000);
    }
  });
}

// Try to create archive for newly added bookmark
Browser.bookmarks.onCreated.addListener((_id, bookmark) => {
  if (bookmark.url) {
    ArchiveBookmark(bookmark.title, bookmark.url);
  }
});

Browser.bookmarks.onChanged.addListener((_id, changeInfo) => {
  if (changeInfo.url) {
    ArchiveBookmark(changeInfo.title, changeInfo.url);
  }
});

export {};
