import { test, expect } from '@playwright/test'
import {PageManager} from '../Page-objects/pageManager'
import { argosScreenshot } from "@argos-ci/playwright";


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('navigate from page @smoke', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'welcome', 'Option 1')
    await pm.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', true)
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(6, 15)

})

test('testing with argos ci', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "form layouts page")
    await pm.navigateTo().datepickerPage()
    await argosScreenshot(page, "form datepicker page")
})


