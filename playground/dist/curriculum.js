/* Task briefs only; intentionally no automation solutions. */
window.LAB_CURRICULUM = {
  "controls": {
    "features": [
      "page.get_by_label()",
      "locator.fill()",
      "locator.select_option()",
      "locator.check()",
      "expect(locator).to_have_value()",
      "expect(locator).to_be_checked()"
    ],
    "hint": "Use labels for inputs and role + accessible name for buttons. Pass multiple values to select_option for the tools list. Use Playwright expect assertions for UI state.",
    "tasks": [
      [
        "C1 · Save a complete profile",
        "Use Ada Lovelace, ada@example.com, Poland, Playwright + Python, Pro, and 2026-01-15. Accept the terms and save.",
        "Every submitted value appears in the summary; selected options and checked controls match your choices."
      ],
      [
        "C2 · Required fields",
        "Submit an empty form, then a form with an invalid email, then a valid form without accepting the terms. Keep these cases independent.",
        "No “Profile saved” summary appears. Avoid asserting browser-specific validation bubble wording."
      ],
      [
        "C3 · Parameterize countries",
        "Repeat a valid submission for Poland and Germany using pytest.mark.parametrize.",
        "Each case starts fresh and the summary contains its own country."
      ]
    ],
    "docs": [
      "input",
      "test-assertions",
      "test-runners"
    ]
  },
  "locators": {
    "features": [
      "page.get_by_role()",
      "locator.filter(has_text=...)",
      "locator.get_by_role()",
      "page.get_by_test_id()",
      "expect(locator).to_have_count()"
    ],
    "hint": "First locate the named collection, then its button. Avoid first/nth to hide ambiguity. Try both a user-facing locator and the explicit test ID contract.",
    "tasks": [
      [
        "L1 · Scope the duplicate button",
        "Add Featured headphones twice.",
        "Featured quantity is 2; Archive quantity stays 0."
      ],
      [
        "L2 · Inspect strictness",
        "Temporarily target “Add to cart” without scoping and observe the failure. Fix the locator, not the timeout.",
        "Your final test uniquely targets the intended button."
      ],
      [
        "L3 · Disclosure",
        "Open Delivery details, verify the free-delivery text, then close it.",
        "The message is visible when expanded and hidden when collapsed."
      ]
    ],
    "docs": [
      "locators",
      "test-assertions"
    ]
  },
  "timing": {
    "features": [
      "expect(locator).to_be_visible()",
      "expect(locator).to_be_enabled()",
      "expect(locator).to_have_text()",
      "page.clock.install()",
      "page.clock.pause_at()",
      "page.clock.run_for()"
    ],
    "hint": "First solve this using auto-waiting and retrying assertions. In a separate advanced test, install and pause the browser clock before triggering timers. Browser clock control does not advance Python server delays.",
    "tasks": [
      [
        "W1 · Wait for the outcome",
        "Load and approve the report without time.sleep or wait_for_timeout.",
        "The report contains 42 transactions and the final status says Report approved."
      ],
      [
        "W2 · Inspect intermediate states",
        "Observe Preparing report, the report appearing, and approval becoming enabled.",
        "Approval is disabled until the second timer completes. Use a paused clock if you need exact boundary checks."
      ],
      [
        "W3 · Control time",
        "With the browser clock installed and paused, trigger loading, advance 1,200 ms, then another 800 ms.",
        "After 1,200 ms the report exists but approval is disabled; after another 800 ms it is enabled."
      ]
    ],
    "docs": [
      "actionability",
      "test-assertions",
      "clock"
    ]
  },
  "tables": {
    "features": [
      "page.get_by_role(\"row\")",
      "locator.filter(has_text=...)",
      "expect(locator).to_have_text()",
      "page.once(\"dialog\", handler)",
      "locator.select_option()"
    ],
    "hint": "Scope actions to a matching row. Register the confirmation handler before clicking. Pagination shows only the current page; keep any page-search loop bounded.",
    "tasks": [
      [
        "T1 · Filter and sort",
        "Filter Active and search “a”. Verify all matching names across pages in ascending order, then descending order.",
        "Eight matches: Amelia Brown, James Taylor, Liam Chen, Lucas Anderson, Mia Thomas, Noah Davis, Olivia Martin, Sophia Miller."
      ],
      [
        "T2 · Modify one account",
        "Reset, search Olivia Martin, accept Deactivate, then clear the search and inspect the table.",
        "Olivia becomes Inactive; other records retain their original statuses."
      ],
      [
        "T3 · Empty and cancelled states",
        "Search a name that does not exist. In a separate case, dismiss Olivia’s deactivation confirmation.",
        "The empty state is shown for no matches; cancelling leaves Olivia Active."
      ]
    ],
    "docs": [
      "locators",
      "dialogs"
    ]
  },
  "dialogs": {
    "features": [
      "page.once(\"dialog\", handler)",
      "dialog.accept()",
      "dialog.dismiss()",
      "page.expect_popup()",
      "expect(page).to_have_title()",
      "expect(locator).to_be_focused()"
    ],
    "hint": "Register event handling before the triggering action. A browser alert/confirm/prompt is a Dialog; the in-page project modal is ordinary DOM. Capture the popup and assert on that new Page.",
    "tasks": [
      [
        "D1 · Native dialogs",
        "Accept the alert; accept and dismiss confirmation in separate cases; supply Ada to the prompt.",
        "Statuses report acknowledgement, confirmation/cancellation, and Hello, Ada! respectively."
      ],
      [
        "D2 · Modal lifecycle",
        "Open Create project, enter Regression suite and save. In another case press Escape.",
        "Saving reports Project created: Regression suite; Escape closes the modal without creating a project."
      ],
      [
        "D3 · New tab",
        "Capture the help popup, verify its title and message, close it, then interact with the original page.",
        "Popup title is Help · Playwright Lab, and the original page still works."
      ]
    ],
    "docs": [
      "dialogs",
      "pages",
      "events"
    ]
  },
  "files": {
    "features": [
      "locator.set_input_files()",
      "page.expect_file_chooser()",
      "page.expect_download()",
      "download.suggested_filename",
      "download.save_as()",
      "pathlib.Path",
      "pytest tmp_path"
    ],
    "hint": "Resolve fixture paths from your project, not an assumed terminal working directory. Capture downloads before clicking; save into pytest’s tmp_path and inspect their contents.",
    "tasks": [
      [
        "F1 · Upload fixtures",
        "Select playground/fixtures/notes.txt and profile.json together.",
        "Count is 2, both filenames appear, and the note preview includes Hello, Playwright!."
      ],
      [
        "F2 · Clear selection",
        "After uploading, clear the file input using set_input_files with an empty list.",
        "Count becomes 0 and previous previews disappear."
      ],
      [
        "F3 · Verify a download",
        "Capture and save the report, then parse it with Python’s csv module.",
        "Suggested filename is practice-report.csv; headers are id,name,status and there are three data rows."
      ]
    ],
    "docs": [
      "input",
      "downloads"
    ]
  },
  "boundaries": {
    "features": [
      "page.frame_locator()",
      "frame_locator.get_by_label()",
      "page.get_by_role()",
      "expect(locator).to_have_attribute()"
    ],
    "hint": "Use a frame locator for the embedded document. Standard role locators pierce the open shadow root; JavaScript DOM access is unnecessary. Closed shadow roots are a different limitation.",
    "tasks": [
      [
        "B1 · Invalid and valid codes",
        "Submit BAD in the frame, then LAB-2026.",
        "Invalid code is shown first; valid input gives Verification complete inside the frame and confirmation in the parent."
      ],
      [
        "B2 · Shadow switch",
        "Find Email notifications by role switch and toggle it twice.",
        "aria-checked changes false → true → false; component status changes with it."
      ]
    ],
    "docs": [
      "frames",
      "locators"
    ]
  },
  "board": {
    "features": [
      "locator.drag_to()",
      "locator.select_option()",
      "locator.fill()",
      "locator.press()",
      "expect(locator).to_have_count()"
    ],
    "hint": "Check the task inside its destination lane, not just the status message. The note is contenteditable and supports fill. Use ControlOrMeta+Enter for the platform-appropriate shortcut.",
    "tasks": [
      [
        "K1 · Drag a task",
        "Drag Write first test into In progress.",
        "Task is present in In progress and absent from To do; the other tasks stay in place."
      ],
      [
        "K2 · Accessible alternative",
        "Use the task’s move select to send it to Done.",
        "Done contains the task and In progress no longer does."
      ],
      [
        "K3 · Keyboard save",
        "Replace the note with Practice resilient locators and press ControlOrMeta+Enter.",
        "Status is Note saved: Practice resilient locators."
      ]
    ],
    "docs": [
      "input"
    ]
  },
  "network": {
    "features": [
      "page.expect_response()",
      "page.route()",
      "route.fulfill()",
      "route.abort()",
      "page.unroute()",
      "page.request.get()"
    ],
    "hint": "Register routes and response expectations before clicking. Match query strings deliberately. Assert the rendered result as well as response status; do not match browser-specific fetch-error text exactly.",
    "tasks": [
      [
        "N1 · Observe real HTTP",
        "Load products normally, then search hub.",
        "Responses are 200; the UI first shows four products, then USB-C hub only."
      ],
      [
        "N2 · Error and recovery",
        "Force 503 and load. Turn it off and load again.",
        "The warehouse error appears, then four products return and the error clears."
      ],
      [
        "N3 · Mock and abort",
        "In separate tests fulfill the products endpoint with an empty products array, fulfill with one synthetic product, and abort it.",
        "The UI shows No products found, your synthetic product, and an error state respectively."
      ],
      [
        "N4 · API without UI",
        "Use an APIRequestContext to query products with q=hub and with fail=1.",
        "The first response contains P103; the second returns 503. No UI clicks are needed."
      ]
    ],
    "docs": [
      "network",
      "mock",
      "api-testing"
    ]
  },
  "checkout": {
    "features": [
      "pytest.mark.parametrize",
      "page.expect_request()",
      "page.expect_response()",
      "request.post_data_json",
      "page.route()",
      "expect(locator).to_have_text()"
    ],
    "hint": "Treat the steps as a user journey. Assert request payload and visible receipt independently. Keep each failure case isolated and remove a failure route before retrying.",
    "tasks": [
      [
        "E1 · Full purchase",
        "Buy one keyboard and one hub, supply an email, use LEARN10 and Express.",
        "Subtotal $134.00; order request contains P101/P103 quantities of 1; receipt is ORD-1001 for $132.60."
      ],
      [
        "E2 · Pricing matrix",
        "Use the same products with standard/no coupon, express/no coupon, standard/LEARN10, express/LEARN10.",
        "Totals are $134.00, $146.00, $120.60, $132.60 respectively."
      ],
      [
        "E3 · Validation boundaries",
        "Cover empty cart, keyboard quantity 9, out-of-stock lamp, invalid email, and BAD coupon.",
        "Invalid steps cannot proceed; the lamp quantity is disabled; bad coupon reports an error."
      ],
      [
        "E4 · Failed order retry",
        "Return HTTP 500 for the order request, inspect the error, remove the mock and retry.",
        "Place order is re-enabled after failure; retry produces one visible confirmation. Orders are stateless, so this does not test payment idempotency."
      ]
    ],
    "docs": [
      "network",
      "api-testing",
      "test-runners"
    ]
  },
  "storage": {
    "features": [
      "browser.new_context()",
      "context.storage_state()",
      "browser.new_context(storage_state=...)",
      "page.reload()",
      "context.add_init_script()"
    ],
    "hint": "This login uses sessionStorage, which storage_state does not save. The theme uses localStorage and does round-trip. Use a fresh, independently created context for isolation checks; close it afterward.",
    "tasks": [
      [
        "S1 · Session lifetime",
        "Sign in with learner@example.com / practice123, reload, then sign out.",
        "Reload preserves the login in that tab; signing out restores the form."
      ],
      [
        "S2 · Independent contexts",
        "Sign in and choose Ocean in context A; open the same exercise in fresh context B.",
        "B is signed out with Sage; A remains signed in with Ocean."
      ],
      [
        "S3 · Saved state boundary",
        "Save A’s storage_state to tmp_path and load it into a new context C.",
        "C has Ocean but remains signed out. Explain why before trying to restore sessionStorage explicitly."
      ],
      [
        "S4 · Negative login",
        "Use a wrong password in a fresh context.",
        "Incorrect email or password appears and the sign-in form remains."
      ]
    ],
    "docs": [
      "auth",
      "browser-contexts",
      "test-runners"
    ]
  }
};
