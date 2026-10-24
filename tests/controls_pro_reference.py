import pytest
from playwright.sync_api import Page, expect


@pytest.fixture
def controls_page(page: Page, base_url: str | None) -> Page:
    origin = (base_url or "http://127.0.0.1:8000").rstrip("/")
    page.goto(f"{origin}/index.html#controls")
    return page


def fill_profile(page: Page, *, country: str = "Poland", email: str = "ada@example.com",
                 accept_terms: bool = True) -> None:
    page.get_by_label("Full name", exact=True).fill("Ada Lovelace")
    page.get_by_label("Email address", exact=True).fill(email)
    page.get_by_label("Country", exact=True).select_option(label=country)
    page.get_by_label("Tools", exact=False).select_option(["Playwright", "Python"])
    page.get_by_role("radio", name="Pro", exact=True).check()
    page.get_by_label("Start date", exact=True).fill("2026-01-15")
    page.get_by_role("checkbox", name="I accept the practice terms").set_checked(accept_terms)


def test_controls_heading_is_visible(controls_page: Page) -> None:
    heading = controls_page.get_by_role("heading", name="Basic controls", exact=True)
    expect(heading).to_be_visible()


@pytest.mark.parametrize("country", ["Poland", "Germany"])
def test_saves_complete_profile_for_selected_country(controls_page: Page, country: str) -> None:
    fill_profile(controls_page, country=country)

    # Check the configured controls, then the independently rendered output.
    expect(controls_page.get_by_label("Country", exact=True)).to_have_value(country)
    expect(controls_page.get_by_label("Tools", exact=False)).to_have_values(["Playwright", "Python"])
    expect(controls_page.get_by_role("radio", name="Pro", exact=True)).to_be_checked()
    expect(controls_page.get_by_role("radio", name="Starter", exact=True)).not_to_be_checked()
    expect(controls_page.get_by_role("checkbox", name="I accept the practice terms")).to_be_checked()

    controls_page.get_by_role("button", name="Save profile", exact=True).click()

    result = controls_page.get_by_test_id("result")
    expect(result).to_be_visible()
    expect(result).to_have_text(
        "Profile saved\n"
        "Name: Ada Lovelace\n"
        "Email: ada@example.com\n"
        f"Country: {country}\n"
        "Tools: Playwright, Python\n"
        "Plan: Pro\n"
        "Start date: 2026-01-15\n"
        "Terms accepted: Yes"
    )


def test_empty_form_is_not_submitted(controls_page: Page) -> None:
    controls_page.get_by_role("button", name="Save profile", exact=True).click()

    name = controls_page.get_by_label("Full name", exact=True)
    # Native validity is synchronous here. Inspect its reason instead of
    # asserting browser- and language-dependent validation popup text.
    assert name.evaluate("element => element.validity.valueMissing"), (
        "An empty full name should fail required-field validation"
    )
    expect(controls_page.get_by_test_id("result")).to_be_empty()


@pytest.mark.parametrize(
    "invalid_email",
    [
        pytest.param("not-an-email", id="missing-at-sign"),
        pytest.param("ada@", id="missing-domain"),
    ],
)
def test_invalid_email_blocks_submission_until_corrected(controls_page: Page, invalid_email: str) -> None:
    # Everything except the email is valid, isolating the rejection reason.
    fill_profile(controls_page, email=invalid_email)
    save = controls_page.get_by_role("button", name="Save profile", exact=True)
    email = controls_page.get_by_label("Email address", exact=True)
    result = controls_page.get_by_test_id("result")

    save.click()

    assert email.evaluate("element => element.validity.typeMismatch"), (
        f"Expected email format validation to reject {invalid_email!r}"
    )
    expect(result).to_be_empty()

    # Change only the invalid input to prove that it was the blocker.
    email.fill("ada@example.com")
    save.click()

    expect(result).to_be_visible()
    expect(result).to_contain_text("Profile saved")
    expect(result).to_contain_text("Email: ada@example.com")


def test_terms_are_required_before_profile_can_be_saved(controls_page: Page) -> None:
    fill_profile(controls_page, accept_terms=False)
    terms = controls_page.get_by_role("checkbox", name="I accept the practice terms")
    save = controls_page.get_by_role("button", name="Save profile", exact=True)
    result = controls_page.get_by_test_id("result")
    expect(terms).not_to_be_checked()

    save.click()

    assert terms.evaluate("element => element.validity.valueMissing"), (
        "Unchecked terms should fail required-field validation"
    )
    expect(result).to_be_empty()

    terms.check()
    save.click()

    expect(terms).to_be_checked()
    expect(result).to_be_visible()
    expect(result).to_contain_text("Profile saved")
    expect(result).to_contain_text("Terms accepted: Yes")
