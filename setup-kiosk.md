
# Setup Kiosk Instructions
## Prerequisite
- Chrome Browser
- Default Printer configured with default paper set to your badge dimensions
- Badge form linked to the ticket.

## System Flow
Assuming that you already have this linked, the system flow is as such:

1. Scan Ticket QR
2. Popup appear with badge form
3. User select fields to print on badge
4. Press Confirm
5. Print Preview pops up
6. Press Print
7. Badge gets printed out

With the silent printing (TLDR; step 5 & 6 is not needed anymore)
1. Scan Ticket QR
2. Popup appear with badge form
3. User select fields to print on badge
4. Press Confirm
7. Badge gets printed out

## Setup Guide for Kiosk Printing
In Chrome this is called  **"silent printing"**  or  **"kiosk printing"**.

### Steps

* **Step 0** - Create a Chrome shortcut to your desktop

* **Step 1** - Configure your desired printer settings by opening Chrome without ``--kiosk --kiosk-printing``

* **Step 2** - ``Ctrl + P`` or **Print** to pop up the Print Preview and update any settings like *paper size*, *color*, or more

 * **Step 3** - Press **Cancel** & **Close** Chrome to save the settings

#### For Debian-based Linux users (untested)
Make sure you have the prerequisite mentioned above installed before proceeding further.

* **Step 4** - Open **Terminal** and open Chrome with flags
	``
$ google-chrome --kiosk --kiosk-printing
``

* **Step 5** - Now, when you print, badge will be sent directly to the default printer.


#### For Windows users
Make sure you have the prerequisite mentioned above installed before proceeding further.

* **Step 4** - **Right click the shortcut**  and click  **"Properties"**.

* **Step 5** - In the  **"Target"**  field after  **"...chrome.exe"**, type this: ``--kiosk --kiosk-printing``
Note there is a space after ”, then two hyphens (something like this image):   
![mceclip0.png](https://brightpearl.file.force.com/sfc/dist/version/download/?oid=00DD0000000qL9o&ids=0684G00000Q8SJE&d=%2Fa%2F4G000000JhHw%2Fm8v6lk9yEQZ67EXsGvCSd0oPFs.gEC.92PNpHIunzlQ&asPdf=false)

* **Step 6** - Click  **Apply**. Now, when you use this shortcut to Chrome, badge will be sent directly to the default printer for printing.

*Note: To configure your printer again, following Step 4 - 6 but this time, remove the ``--kiosk --kiosk-printing``* 