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
              <div className="text-xl font-bold select-none">通知</div>
              <div className="text-sm select-none">
                如果开启，每次发生存档操作时都会弹出通知，便于了解存档状态
              </div>
              <div className="text-sm select-none">
                请注意：即使关闭本选项，扩展依然会弹出部分致命错误的通知
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
                存档后，替换为归档链接
              </div>
              <div className="text-sm select-none">
                如果开启，存档结束后，原书签里的链接会改为指向归档的链接
              </div>
              <div className="text-sm select-none">
                不推荐开启。之前存档的链接不受影响
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
          <div className="text-xl font-bold select-none">存档所有书签</div>
          <div className="text-sm select-none">
            如果你想要对书签里的所有网址作一次存档，请点击“全部存档”
          </div>
          <div className="pt-4">
            <button
              className="rounded-sm active:bg-blue-600 hover:bg-blue-500 bg-blue-400 py-2 px-4 text-white"
              onClick={() => {
                Browser.runtime.sendMessage({ id: "archiveAll" });
              }}
            >
              全部存档
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
