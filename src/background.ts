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
        title:
          Browser.i18n.getMessage("archiveBookmarkSuccessNotificationTitle") +
          title,
        priority: 2,
        message: Browser.i18n.getMessage(
          "archiveBookmarkSuccessNotificationMessage"
        ),
      });
    } else if (response.status === 429) {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title:
          Browser.i18n.getMessage(
            "archiveBookmarkRateLimitedNotificationTitle"
          ) + title,
        priority: 2,
        message: Browser.i18n.getMessage(
          "archiveBookmarkRateLimitedNotificationMessage"
        ),
      });

      setTimeout(() => {
        ArchiveBookmark(title, url);
      }, 300000);
    } else if (response.status === 523) {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title:
          Browser.i18n.getMessage(
            "archiveBookmarkUnreachableOriginNotificationTitlePrefix"
          ) +
          title +
          Browser.i18n.getMessage(
            "archiveBookmarkUnreachableOriginNotificationTitleAppendix"
          ),
        priority: 2,
        message: Browser.i18n.getMessage(
          "archiveBookmarkUnreachableOriginNotificationMessage"
        ),
      });
    } else {
      Browser.notifications.create("ARCHIVE_BOOKMARK", {
        type: "basic",
        iconUrl: "/logo426.png",
        title:
          Browser.i18n.getMessage(
            "archiveBookmarkUnknownErrorNotificationTitle"
          ) + response.status,
        priority: 2,
        message: Browser.i18n.getMessage(
          "archiveBookmarkUnknownErrorNotificationMessage"
        ),
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
