import React, { useState } from "react";
import "./App.css";
import { Switch } from "@headlessui/react";
import Browser from "webextension-polyfill";

function App(props) {
  const [enabledNotification, setEnabledNotification] = useState(
    props.allowNotification
  );
  const [enabledReplaceURL, setEnabledReplaceURL] = useState(props.replaceURL);
  return (
    <>
      <Switch.Group>
        <ul className="py-6 space-y-6 px-6">
          <li className="flex items-center">
            <Switch.Label className="flex flex-col mr-4">
              <div className="text-xl font-bold select-none">
                {Browser.i18n.getMessage("settingNotificationTitle")}
              </div>
              <div className="text-sm select-none">
                {Browser.i18n.getMessage("settingNotificationDescriptionFirst")}
              </div>
              <div className="text-sm select-none">
                {Browser.i18n.getMessage(
                  "settingNotificationDescriptionSecond"
                )}
              </div>
            </Switch.Label>
            <div className="flex-1" />
            <Switch
              checked={enabledNotification}
              onChange={(boolean) => {
                setEnabledNotification(boolean);
                Browser.storage.sync.set({ allowNotification: boolean });
                Browser.runtime.sendMessage({ id: "optionChange" });
              }}
              className={`${
                enabledNotification ? "bg-blue-600" : "bg-gray-200"
              } relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  enabledNotification ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </li>
          <li className="flex items-center">
            <Switch.Label className="flex flex-col mr-4">
              <div className="text-xl font-bold select-none">
                {Browser.i18n.getMessage("settingChangeLinkAfterArchiveTitle")}
              </div>
              <div className="text-sm select-none">
                {Browser.i18n.getMessage(
                  "settingChangeLinkAfterArchiveDescriptionFirst"
                )}
              </div>
              <div className="text-sm select-none">
                {Browser.i18n.getMessage(
                  "settingChangeLinkAfterArchiveDescriptionSecond"
                )}
              </div>
            </Switch.Label>
            <div className="flex-1" />
            <Switch
              checked={enabledReplaceURL}
              onChange={(boolean) => {
                setEnabledReplaceURL(boolean);
                Browser.storage.sync.set({ replaceURL: boolean });
                Browser.runtime.sendMessage({ id: "optionChange" });
              }}
              className={`${
                enabledReplaceURL ? "bg-blue-600" : "bg-gray-200"
              } relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  enabledReplaceURL ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </li>
        </ul>
      </Switch.Group>
      <div className="flex items-center pb-6 space-y-6 px-6">
        <div className="flex flex-col mr-4">
          <div className="text-xl font-bold select-none">
            {Browser.i18n.getMessage("settingArchiveAllBookmarksTitle")}
          </div>
          <div className="text-sm select-none">
            {Browser.i18n.getMessage("settingArchiveAllBookmarksDescription")}
          </div>
          <div className="pt-4">
            <button
              className="rounded-sm active:bg-blue-600 hover:bg-blue-500 bg-blue-400 py-2 px-4 text-white"
              onClick={() => {
                Browser.runtime.sendMessage({ id: "archiveAll" });
              }}
            >
              {Browser.i18n.getMessage("settingArchiveAllBookmarksButton")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
