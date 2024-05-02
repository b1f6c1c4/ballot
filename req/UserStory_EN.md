# Ballot User Stories

## Alice, the organizer

Alice wants to initiate an anonymous online poll. After learning about the features of ballot.b1f6c1c4.info, she accesses http://ballot.b1f6c1c4.info via her browser, which automatically redirects to https://ballot.b1f6c1c4.info/ and quickly loads the homepage, automatically recognizing the local English environment. Alice manually switches the page to Chinese. On the homepage, she learns about Ballot's basic features and usage, then clicks the "Register" button at the bottom.

The browser redirects to the registration page. Alice fills in a username and password, then clicks the "Register" button. The browser then navigates to the login page, where the username is already autofilled. Alice enters her password and clicks the "Login" button.

The browser redirects to the control panel page, which clearly indicates the entry point for initiating a new poll. Alice quickly finds and clicks the "Create Ballot" button.

The browser navigates to the new poll initiation page. Alice fills in the poll name and clicks the "Create" button. A "Confirm Ballot" dialog box then pops up; Alice reads the instructions carefully and confirms.

The browser redirects to the poll control panel, clearly showing the poll status as "Creating". Alice clicks the field edit button on the page.

The browser navigates to the poll editing page. Alice clicks the + sign, which brings up an add field dialog box. She fills in the field prompt, selects "single choice" as the type, and adds several options. Alice then changes the type to a fill-in-the-blank and back to single choice, noticing that the previously entered options were not lost. Finally, Alice clicks the add button, and a new single-choice field appears on the page, along with corresponding edit and delete buttons.

Alice almost closes the browser, but a popup window warns of potential unsaved changes. She clicks the cancel button, then the save changes button, and the system confirms that the field information has been saved.

Alice tries clicking the edit button, opening the "Edit Field" dialog box, which is similar to the previous one. She then clicks the delete button, and a confirm delete field dialog box appears. After confirming the deletion and wanting to revert the previous operation, she clicks the discard changes button, which after confirmation restores to the last saved field list.

After a while, the poll status automatically changes to "Inviting", and Alice is notified that the key is ready, and she can invite voters. Alice clicks the poll name at the top to return to the control panel, then clicks the voter edit button, which navigates to the poll management page for voters. Alice enters a voter's name and clicks "Add Voter", then "Add". Below, a new voter appears, including status (currently "Unregistered"), name, delete button, and more information button. Expanding more information, Alice receives the voter's invitation code and QR code for the invitation link. Alice adds many voter entries like this, then clicks the "Export" button to export the names and invitation codes to an Excel file and saves it locally.

Alice prints out the Excel file, cuts it into small strips, and distributes them to voters through confidential offline channels. When a voter registers, Alice on her mobile phone's voter management page sees the registration in real time, displaying the voter as registered and updating their remarks and status (from "Unregistered" to "Registered").

Alice mistakenly adds a voter and clicks the corresponding delete button. After confirmation, the voter disappears from the list.

After all voters have registered, Alice clicks the "End Invitation" button on the poll control panel page, reads the related explanation on the page carefully, and confirms. The browser refreshes, showing the poll status as "Invitation Complete", and displays summaries of the poll content and voter information, each with an "Edit" and a "View" button, respectively. Noting that the poll content is finalized, Alice clicks the "Start Pre-voting" button, reads the related information on the page carefully, and confirms.

The poll status on the control panel page changes to "Pre-voting". Alice distributes the pre-voting link through other channels, notifying voters to participate in the pre-voting.

At a specific time (previously communicated to the voters), Alice clicks the "Start Official Voting" button on the poll control panel page, reads the instructions on the page carefully, and confirms. The poll status changes to "Official Voting", and the page now includes a display of the voting results. Alice distributes the official voting link through other channels, notifying voters to participate in the official voting.

At a specific time (previously communicated to the voters), Alice clicks the "End Official Voting" button on the poll control panel page, reads the instructions on the page carefully, and confirms. The poll status changes to "Ended". Alice clicks the "Export" button on the poll results page, saving the voting results locally.

## Bob, the voter

Bob received an invitation link from Alice through a confidential offline channel. After opening it, his browser redirected him to a voter registration page. Bob entered a remark and clicked register. A dialog box popped up confirming his registration as a voter. Bob confirmed, and a long string of private key appeared on the page, which he safely saved.

Bob received a notification from Alice that the pre-voting had started, and accessed the pre-voting page through his browser. The page clearly displayed the name and content of the vote. After filling in the fields, Bob uploaded the private key from his local device to the browser and clicked the "Generate Signature" button. A progress bar appeared below, and about a minute later, the signed voting content appeared. Bob saved this to his local device.

After receiving a notification from Alice that the official voting had begun, Bob accessed the official voting page via his browser. The page explicitly warned that voting could not be done with a regular browser and mandated the use of Tor browser or the torsocks command-line tool. Bob used the Tor browser to access the official voting page. The page clearly showed the privacy and security status (IP, timezone, Locale, Javascript status, etc.), and any incorrect item would trigger a warning preventing voting. After confirming that all privacy and security statuses were correct, Bob pasted the signed voting content into the text box and submitted it.

The Tor browser redirected to a temporary submission page, which clearly indicated that the vote had been received and was verifying the signature. Bob clicked the "Check" button below to verify the voting status. The Tor browser redirected to either a temporary submission page or a successful submission page. After confirming the submission was successful, Bob closed the Tor browser.

Later, before the voting was closed by Alice, Bob changed his mind and decided to change his vote. He revisited the pre-voting page, refilled the fields, pasted the private key, executed the signature, then accessed the official voting page via Tor browser, submitted the signed vote, and verified that the voting status was successful.

## Victor, the verifier

Victor wants to verify the authenticity of the votes. He receives a link to the voting from Alice. By accessing the link, Victor can see the voting parameters (status as "concluded"), the voting content, the voters, and the voting statistics.

First, Victor verifies that each vote originates from the purported voter. He clicks on "Export Data" for the voters, the voting statistics, and the voting parameters. From the data, he concludes that each vote comes from a specific voter and that no voter has voted more than once.

Next, Victor verifies that each supposed voter is real and not a proxy voting on behalf of Alice. Victor contacts Bob through offline channels to directly verify his identity.
