# Multi-Tab-Base-URL-Web-Scraper
Using a base URL it will scrape the data, append all data to each other, and download as 1 text file.


============================================================
 MULTI-TAB URL SCRAPER  -  INSTALL & USE GUIDE
 Version 1.4
============================================================

WHAT THIS IS
------------------------------------------------------------
A small browser extension that collects links from several
open tabs at once. You highlight the tabs you want, click a
toolbar button, type a base URL to filter by, and it saves
every matching link from all of those tabs into a single
text file with duplicates removed.

It works in Chrome, Vivaldi, Brave, and Firefox.


WHAT'S IN THE FOLDER
------------------------------------------------------------
Three files. All three must sit together in ONE folder:

   manifest.json   - tells the browser what the extension is
   popup.html      - the little window that opens
   popup.js        - the logic that does the scraping

Do not rename them, and do not split them into separate
folders. (You can keep this guide in the folder too; it
won't interfere with anything.)


------------------------------------------------------------
 INSTALL  -  CHROME, VIVALDI, or BRAVE
------------------------------------------------------------
These three browsers share the same engine, so the steps are
identical. Only the address in step 1 differs. On these
browsers the extension stays installed after a restart, so
there is nothing more to do.

1. Type one of these into the address bar and press Enter:
        Chrome    ->  chrome://extensions
        Vivaldi   ->  vivaldi://extensions
        Brave     ->  brave://extensions

2. Turn ON "Developer mode" (toggle in the top-right corner).

3. Click "Load unpacked".

4. Select the FOLDER that holds the three files. Select the
   folder itself, not the files inside it.

5. The extension appears in your list. Click the puzzle-piece
   icon in the toolbar and pin "Multi-Tab URL Scraper" so its
   button stays visible.


------------------------------------------------------------
 INSTALL  -  FIREFOX  (TEMPORARY / QUICK TEST)
------------------------------------------------------------
Use this to try it out. It is quick, but a temporary add-on
is removed every time you close Firefox. For a permanent
install, see "MAKE IT PERMANENT IN FIREFOX" below.

1. Type this into the address bar and press Enter:
        about:debugging#/runtime/this-firefox

2. Click "Load Temporary Add-on...".

3. Open your extension folder and select the file named:
        manifest.json

4. The extension loads and its button appears in the toolbar.

Note: a temporary add-on disappearing on restart is Firefox's
rule for unsigned extensions, not a bug. To keep it for good,
get it signed (next section).


------------------------------------------------------------
 MAKE IT PERMANENT IN FIREFOX  (GET IT SIGNED)
------------------------------------------------------------
To install permanently in normal Firefox, the add-on must be
"signed" by Mozilla. This is free. For a private tool you use
the "self-distribution" (unlisted) route, which signs the
add-on WITHOUT listing it in the public store.

About the extension ID and data declaration:
   manifest.json's browser_specific_settings block carries two
   things Mozilla needs in order to sign the add-on:

        "browser_specific_settings": {
          "gecko": {
            "id": "multi-tab-url-scraper@stephen.local",
            "data_collection_permissions": { "required": ["none"] }
          }
        }

   - The ID is a unique label (not a real email; nothing is
     sent to it). Keep it EXACTLY the same in every future
     version, or Firefox will treat a new signed file as a
     different add-on instead of an update.
   - "data_collection_permissions" is now required by Mozilla
     for new extensions. This one only reads links and saves
     them to a file on your computer; it never transmits any
     data, so it declares "none". Once this key is present it
     must stay in every future version.

Getting it signed:

1. Go to addons.mozilla.org and click "Register or Log in"
   (free; uses a Firefox account).

2. Open the Developer Hub and click "Submit a New Add-on".

3. When asked how to distribute it, choose "On your own".
   That is the unlisted / self-distribution path: it gets
   signed but never appears in the public store.

4. Upload the .zip of the three files. (manifest.json must be
   at the root of the zip; the provided package is already
   built that way.) Automated checks run right away. The code
   is plain JavaScript, so there is no source package to add.

5. Wait for the signed file. For unlisted add-ons this is
   usually quick, though Mozilla allows up to 24 hours. Then
   download the signed ".xpi" from your add-on's page in the
   Developer Hub.

Installing the signed file:

6. Remove the temporary copy first so the matching ID does
   not collide: on about:debugging, click "Remove".

7. Open about:addons, click the GEAR icon, and choose
   "Install Add-on From File...". Select the signed ".xpi".
   It now stays installed across restarts.

Re-signing later (for example, if a Firefox update breaks it):
   - Edit the code.
   - Raise "version" in manifest.json to a higher number
     (1.3 -> 1.4, and so on). It MUST increase each time.
   - Re-zip the three files.
   - Repeat steps 2-7. Keep the same ID, so Mozilla treats it
     as an update to the same add-on.


------------------------------------------------------------
 HOW TO USE IT
------------------------------------------------------------
1. Open the tabs you want to scrape.

2. Highlight the ones you want:
      - Hold Ctrl (Cmd on Mac) and click each tab, OR
      - Click the first tab, then hold Shift and click the
        last tab to grab everything in between.
   Highlighted tabs look brighter / selected.
   If you highlight nothing, it simply scrapes the one tab
   you are currently on.

3. Click the "Multi-Tab URL Scraper" button in the toolbar.

4. A small window opens with a text box. It is pre-filled
   with the current tab's website as a starting point. Edit
   it to the address you want to filter by, for example:
        https://www.example.com/gallery/
   Only links that START WITH this exact text are kept.

5. Click "Scrape highlighted tabs".

6. The file is saved. WHERE it goes depends on one browser
   setting (see "CHOOSING WHERE THE FILE SAVES" below):
      - If "always ask where to save" is ON, a Save dialog
        opens. Pick a folder, type any filename you like
        (it suggests "filtered_urls.txt"), and save.
      - If it is OFF, the file drops straight into your
        Downloads folder as "filtered_urls.txt", no dialog.

Either way you end up with one text file containing every
matching link from all the selected tabs, one per line,
duplicates removed.


------------------------------------------------------------
 CHOOSING WHERE THE FILE SAVES  (the Save dialog)
------------------------------------------------------------
If you want to pick the folder and filename each time, turn
on your browser's "ask where to save" setting:

   Firefox:
      Settings -> General -> Files and Applications ->
      Downloads -> select "Always ask you where to save files".

   Chrome / Vivaldi / Brave:
      Settings -> Downloads -> turn ON
      "Ask where to save each file before downloading".

With that on, every download (including this one) opens a
Save dialog. With it off, files save straight to Downloads.


------------------------------------------------------------
 FIRST-TIME PERMISSION  (mainly Firefox)
------------------------------------------------------------
The first time you scrape, the extension may need permission
to read your tabs. If tabs get skipped, the popup shows a
button labeled "Grant access to sites". Click it once, allow
the request, then click "Scrape" again. You only do this once.


------------------------------------------------------------
 GOOD TO KNOW
------------------------------------------------------------
- ONE filter for all tabs. The base URL you type is applied
  to every highlighted tab, so it works best when the tabs
  you select are all on the same website.

- Duplicates are removed across the whole batch. The same
  link appearing in two tabs shows up only once.

- System pages are skipped automatically. Browser settings,
  the extensions page, "about:" pages, and PDF viewers cannot
  be read, so the extension ignores them and tells you how
  many it skipped.

- Cancelling is safe. If you close the Save dialog without
  choosing a location, nothing is saved.

- Re-running with the Save dialog ON lets you name each file,
  so you will not overwrite a previous one unless you choose
  to. With the dialog OFF, repeats become
  "filtered_urls(1).txt", "filtered_urls(2).txt", and so on.


------------------------------------------------------------
 UPDATING THE EXTENSION  (after editing any file)
------------------------------------------------------------
TEMPORARY / UNPACKED installs (Chrome, Vivaldi, Brave, and
the Firefox quick-test method): the browser keeps running the
OLD copy until you tell it to reload.

   Chrome / Vivaldi / Brave:
      Return to the extensions page and click the circular
      reload arrow on the extension's card.

   Firefox (temporary):
      On the about:debugging page, click "Reload" under the
      extension, or just load it again.

SIGNED install in Firefox: reloading does not apply. To
update, bump the version, re-zip, re-sign, and install the
new signed file, as described in "MAKE IT PERMANENT IN
FIREFOX".


------------------------------------------------------------
 TROUBLESHOOTING
------------------------------------------------------------
"No matching links found"
   - Check the base URL. It must match the start of the links
     exactly, including http:// vs https:// and the www.
   - Make sure the tabs you meant to scrape are highlighted.

"Tabs were blocked" / everything skipped
   - Click "Grant access to sites" in the popup, then scrape
     again (see the permission note above).

The button does nothing, or the window looks broken
   - Make sure all three files are in the same folder and none
     were renamed, then reload the extension.

Nothing downloads
   - Confirm you did not cancel the Save dialog.
   - Confirm the extension still appears. If it was the Firefox
     temporary copy, a restart removes it; load it again or
     install the signed version.

Signing was rejected or flagged
   - "data_collection_permissions is missing": every new
     extension must declare its data collection. This one is
     already set to "none" in the manifest; make sure that key
     is present (see "MAKE IT PERMANENT IN FIREFOX").
   - Read the validation messages on the Developer Hub. Broad
     access ("<all_urls>") may be noted but does not block
     signing for a self-distributed add-on.
   - Make sure the version number is higher than any version
     you already submitted.


------------------------------------------------------------
 VERSION HISTORY
------------------------------------------------------------
v1.0  -  Initial build.
         - Scrapes links from all highlighted tabs at once.
         - Filters by a base URL you type; keeps only links
           that start with it.
         - Merges results from every selected tab into one
           file and removes duplicates across the whole batch.
         - Skips browser and system pages automatically.
         - Saved the file straight to the Downloads folder.

v1.1  -  Added a Save dialog.
         - Let you choose the folder and filename instead of
           always saving to the Downloads folder.
         - Treated cancelling that dialog as a no-op rather
           than reporting it as an error.

v1.2  -  Fixed downloads failing in Firefox.
         - Firefox closes the popup the instant the Save
           dialog opens. That wiped the temporary in-memory
           data the download relied on, so the save failed
           right after you clicked Save.
         - Switched from the extension download API to the
           browser's built-in download-link method, which
           captures the data immediately and works the same
           in Firefox, Chrome, Vivaldi, and Brave.
         - Side effect: whether a Save dialog appears is now
           controlled by your browser's "ask where to save"
           setting (see "CHOOSING WHERE THE FILE SAVES")
           rather than being forced by the extension.

v1.3  -  Prepared for permanent (signed) install in Firefox.
         - Added a fixed extension ID to the manifest, which
           Mozilla requires to sign a self-distributed add-on.
           The ID must stay the same in every future version
           so Firefox treats new signed files as updates.
         - Removed the unused "downloads" permission (the
           download now uses a plain link, which needs no
           permission), trimming what the browser asks you to
           approve.
         - Added the "MAKE IT PERMANENT IN FIREFOX" steps to
           this guide. No change to how the extension behaves.

v1.4  -  (current) Met Mozilla's new data-disclosure rule.
         - As of November 3, 2025, Mozilla requires every new
           extension to declare what user data it collects.
           Without it, signing is rejected with a "missing
           data_collection_permissions" error.
         - Added "data_collection_permissions": { "required":
           ["none"] } to the manifest. This extension reads
           links and saves them locally and transmits nothing,
           so "none" is the accurate declaration.
         - This key must remain in all future versions. No
           change to how the extension behaves.

============================================================
