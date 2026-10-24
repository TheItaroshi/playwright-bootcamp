import pytest

from playwright.sync_api import Page, expect


def test_controls_title(page: Page):
    page.goto('http://127.0.0.1:8000/index.html#controls')
    assert page.locator('#title').inner_text() == 'Basic controls'

def test_controls_profile(page: Page):
    page.goto('http://127.0.0.1:8000/index.html#controls')
    profile_locator =  page.locator('#profile')
    name_locator = profile_locator.locator('#name')
    email_locator = profile_locator.locator('#email')
    country_locator = profile_locator.locator('#country')
    tools_locator = profile_locator.locator('#tools')
    plan_starter_locator = profile_locator.get_by_role('radio', name='Starter')
    plan_pro_locator = profile_locator.get_by_role('radio', name='Pro')
    date_locator = profile_locator.locator('#start')
    terms_locator = profile_locator.get_by_role('checkbox', name='I accept the practice terms')
    button_locator = profile_locator.get_by_role('button', name='Save profile')

    values = {
        'name': 'Ada Lovelace',
        'email': 'ada@example.com',
        'country': 'Poland',
        'tools': ['Playwright', 'Python'],
        'date': '2026-01-15'
    }

    name_locator.fill(values.get('name'))
    email_locator.fill(values.get('email'))
    country_locator.select_option(values.get('country'))
    tools_locator.select_option(values.get('tools'))
    plan_pro_locator.check()
    date_locator.fill(values.get('date'))
    terms_locator.check()
    button_locator.click()
    result_locator = page.locator('#result')

    assert plan_pro_locator.is_checked()
    assert terms_locator.is_checked()
    assert not plan_starter_locator.is_checked()

    expect(country_locator).to_have_value(values.get('country'))
    expect(tools_locator).to_have_values(values.get('tools'))
    expect(plan_pro_locator).to_be_checked()
    expect(plan_starter_locator).not_to_be_checked()
    expect(terms_locator).to_be_checked()

    flat_values = [item for value in values.values() for item in (value if isinstance(value, list) else [value])]

    for value in flat_values:
        expect(result_locator).to_contain_text(value)

def test_empty_profile(page: Page):
    page.goto('http://127.0.0.1:8000/index.html#controls')
    result_locator = page.locator('#result')

    expect(result_locator).to_be_hidden()
    expect(result_locator).to_be_empty()

def test_wrong_email(page: Page):
    page.goto('http://127.0.0.1:8000/index.html#controls')
    profile_locator =  page.locator('#profile')
    name_locator = profile_locator.locator('#name')
    email_locator = profile_locator.locator('#email')
    button_locator = profile_locator.get_by_role('button', name='Save profile')
    result_locator = page.locator('#result')

    values = {
        'name': 'Ada Lovelace',
        'email': 'wrong mail',
    }

    name_locator.fill(values.get('name'))
    email_locator.fill(values.get('email'))

    button_locator.click()

    assert email_locator.evaluate('element => element.validity.typeMismatch')
    expect(result_locator).to_be_hidden()
    expect(result_locator).to_be_empty()
