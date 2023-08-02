import Browser from "webextension-polyfill";
import { options } from "./data/optionKeys";

function fetchOptions() {
  Browser.storage.sync.get().then((items) => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(options, items);
  });
}

function loopBookmark(bookmark) {
  if (bookmark.url) {
    ArchiveBookmark(
      undefined,
      bookmark.title,
      bookmark.url,
      options.allowNotification
    );
  }

  if (bookmark.children) {
    for (const child of bookmark.children) {
      loopBookmark(child);
    }
  }
}

function onMessage(request, sender, sendResponse) {
  if (request.id === "optionChange") {
    fetchOptions();
  } else if (request.id === "archiveAll") {
    Browser.notifications.create("ARCHIVE_BOOKMARK", {
      type: "basic",
      iconUrl: "/logo426.png",
      title: "正在存档书签里的所有网页",
      priority: 2,
      message: "这可能需要非常长的时间，请耐心等待",
    });

    Browser.bookmarks.getTree().then((result) => {
      const root = result[0];
      loopBookmark(root);
    });
  }
}

function ArchiveBookmark(
  id: string | undefined,
  title: string,
  url: string,
  isNotificationAllowed: boolean
) {
  if (isNotificationAllowed) {
    Browser.notifications.create("ARCHIVE_BOOKMARK", {
      type: "basic",
      iconUrl: "/logo426.png",
      title:
        Browser.i18n.getMessage("archiveBookmarkNotificationTitle") + title,
      priority: 2,
      message: Browser.i18n.getMessage("archiveBookmarkNotificationMessage"),
    });
  }

  const postURL = [
    "https://web.archive.org/save/" + url,
    "https://archive.is/submit/",
  ];

  const archiveIsFormData = new FormData();
  archiveIsFormData.append("url", url);

  const postForm = [undefined, archiveIsFormData];
  const postMethod = ["GET", "POST"];

  fetch(postURL[options.selectedEngineId], {
    body: postForm[options.selectedEngineId],
    method: postMethod[options.selectedEngineId],
  }).then((response) => {
    if (response.ok) {
      if (isNotificationAllowed) {
        if (options.replaceURL && id) {
          Browser.bookmarks.update(id, {
            url: response.url,
          });
        }

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
      }
    } else if (response.status === 429) {
      if (isNotificationAllowed) {
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
      }

      setTimeout(() => {
        ArchiveBookmark(id, title, url, isNotificationAllowed);
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
      if (isNotificationAllowed) {
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
      }

      setTimeout(() => {
        ArchiveBookmark(id, title, url, isNotificationAllowed);
      }, 300000);
    }
  });
}

// Try to create archive for newly added bookmark
Browser.bookmarks.onCreated.addListener((id, bookmark) => {
  if (bookmark.url) {
    ArchiveBookmark(
      id,
      bookmark.title,
      bookmark.url,
      options.allowNotification
    );
  }
});

Browser.bookmarks.onChanged.addListener((id, changeInfo) => {
  if (
    changeInfo.url &&
    !changeInfo.url.startsWith("https://web.archive.org/") // Do not archive web.archive.org itself!
  ) {
    ArchiveBookmark(
      id,
      changeInfo.title,
      changeInfo.url,
      options.allowNotification
    );
  }
});

Browser.runtime.onMessage.addListener(onMessage);

fetchOptions();

export {};
