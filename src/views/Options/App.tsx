import React, { useState, Fragment } from "react";
import "./App.css";
import { Listbox, Switch, Transition } from "@headlessui/react";
import Browser from "webextension-polyfill";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const archiveEngines = [
  { name: "Web Archives", id: 0 },
  { name: "Archive.is", id: 1 },
];

function App(props) {
  const [enabledNotification, setEnabledNotification] = useState(
    props.allowNotification
  );
  const [enabledReplaceURL, setEnabledReplaceURL] = useState(props.replaceURL);
  const [selectedEngine, setSelectedEngine] = useState(props.selectedEngineId);

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
          <div className="text-xl font-bold select-none">存档引擎</div>
          <div className="text-sm select-none">
            默认情况下，书签存档机使用 Web Archives
            进行存档操作。你也可以另选一个喜欢的引擎
          </div>
        </div>
        <div className="flex-1" />
        <div className="w-24 shrink-0">
          <Listbox
            value={archiveEngines[selectedEngine]}
            onChange={(selection) => {
              setSelectedEngine(selection.id);
              Browser.storage.sync.set({ selectedEngineId: selection.id });
              Browser.runtime.sendMessage({ id: "optionChange" });
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                <span className="block truncate">
                  {archiveEngines[selectedEngine].name}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {archiveEngines.map((archiveEngine, archiveEngineIdx) => (
                    <Listbox.Option
                      key={archiveEngineIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-2 pr-2 ${
                          active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                        }`
                      }
                      value={archiveEngine}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {archiveEngine.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
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
