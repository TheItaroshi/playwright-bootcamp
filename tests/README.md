# Your Python tests

Write your own Playwright + pytest tests here, starting with `test_controls.py`.
Use the synchronous API from `playwright.sync_api`. The learning path at
http://127.0.0.1:8000/guide.html explains setup and assignments.

Suggested organization as your suite grows:

- `test_controls.py`, `test_locators.py`, etc.: independent tests per exercise.
- `conftest.py`: shared pytest fixtures once you need them.
- `pages/`: optional page objects once repeated workflows justify them.

Keep reusable upload files in `playground/fixtures/`. Use pytest's `tmp_path`
for generated downloads and saved browser state. Do not commit authentication
state, traces, or local environment files.

The automation is learning work; a worked reference is available for comparison.

## Basic controls

- `test_controls.py` contains practice tests.
- `controls_pro_reference.py` is the self-describing pro example. Pytest skips it during automatic collection; run it explicitly with `pytest tests/controls_pro_reference.py`.
