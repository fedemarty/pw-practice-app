import {test, expect} from '@playwright/test'


test.beforeEach(async({page}, testInfo)=>{
    await page.goto(process.env.URL)
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    //testInfo.setTimeout(testInfo.timeout + 2000)
})

test('Locator syntax rules', async ({ page }) => {
  
    // by Tag name
    page.locator('input')
  
    // by ID
    await page.locator('#inputEmail1').click()
  
    // by Class value
    page.locator('.shape-rectangle')
  
    // by attribute
    page.locator('[placeholder="Email"]')
  
    // by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
  
    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')
  
    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')
  
    // by partial text match
    page.locator(':text("Using")')
  
    // by exact text match
    page.locator(':text-is("Using the Grid")')
    
})

test('user facing locators', async({page})=>{
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()
    
    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the grid').click()

    await page.getByTestId('SignIn').click()

    //await page.getByTitle('IoT Dashboard').click()
})

test('locating child elements', async ({ page }) => {

    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
  
    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()
  
    await page.locator('nb-card').nth(3).getByRole('button').click()
  })



  test('locating parent elements', async ({ page }) => {
    // Busca un nb-card que contenga el texto "Using the Grid" y dentro de él, hace clic en el input de tipo textbox cuyo name sea "Email"
    await page.locator('nb-card', { hasText: "Using the Grid" })
      .getByRole('textbox', { name: "Email" }).click()
  
    // Busca un nb-card que contenga un elemento con id "inputEmail1", y dentro de él hace clic en el textbox con name "Email"
    await page.locator('nb-card', { has: page.locator('#inputEmail1') })
      .getByRole('textbox', { name: "Email" }).click()
  
    // Busca un nb-card que contenga el texto "Basic form" y hace clic en el textbox con name "Email"
    await page.locator('nb-card').filter({ hasText: "Basic form" })
      .getByRole('textbox', { name: "Email" }).click()
  
    // Busca un nb-card que contenga un elemento con la clase .status-danger y hace clic en el textbox con name "Password"
    await page.locator('nb-card')
      .filter({ has: page.locator('.status-danger') })
      .getByRole('textbox', { name: "Password" }).click()
  
    // Busca un nb-card que contenga un checkbox y además contenga el texto "Sign in", luego hace clic en el textbox con name "Email"
    await page.locator('nb-card')
      .filter({ has: page.locator('nb-checkbox') })
      .filter({ hasText: "Sign in" })
      .getByRole('textbox', { name: "Email" }).click()
  
    // Busca un elemento que tenga el texto exacto "Using the Grid", sube un nivel en el DOM (con '..') y luego hace clic en el textbox con name "Email"
    await page.locator(':text-is("Using the Grid")')
      .locator('..')
      .getByRole('textbox', { name: "Email" }).click()
  })

  test('Reusing the locators', async ({ page }) => {
    // Guardamos en una constanteLocaliza el componente 'nb-card' que contenga el texto "Basic form"
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
  
    // Dentro del 'basicForm', localiza el campo de texto con nombre "Email"
    const emailField = basicForm.getByRole('textbox', { name: "Email" })
  
    // Completa el campo de email con el texto 'test@test.com'
    await emailField.fill('test@test.com')
  
    // Dentro del 'basicForm', localiza el campo de texto con nombre "Password" y lo completa con 'Welcome123'
    await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123')
  
    // Dentro del 'basicForm', localiza el checkbox (usando su selector CSS) y hace clic
    await basicForm.locator('nb-checkbox').click()
  
    // Dentro del 'basicForm', localiza el botón y hace clic (probablemente para enviar el formulario)
    await basicForm.getByRole('button').click()
  
    // Verifica que el campo de email tenga el valor 'test@test.com'
    await expect(emailField).toHaveValue('test@test.com')
  })

  test('extracting values', async({page}) =>{
    //single test value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placHolderValue = await emailField.getAttribute('placeholder')
    expect(placHolderValue).toEqual('Email')
  })

test('assertions', async({page}) =>{
  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')
  //General assertions
  const value = 5
  expect(value).toEqual(5)

  const text = await basicFormButton.textContent
  expect(text).toEqual("Submit")

  //Locator assertion
  await expect(basicFormButton).toHaveText('Submit')

  //Soft Assertion
  await expect.soft(basicFormButton).toHaveText('Submit5')
  await basicFormButton.click()
  })



test('auto  waiting', async({page}) =>{
  const successButton = page.locator('.bg-success')

  const text = await successButton.textContent()
  await successButton.waitFor({state: "attached"})
  //const text = await successButton.allTextContents()

  expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})

  })

test('alternative waits', async({page}) =>{
  const successButton = page.locator('.bg-success')

  await successButton.click()

  //___ wait for element
  await page.waitForSelector('.bg-success')

  //___ wait for particualr response
  await page.waitForResponse('http')

  //__ wait for network calls to be completed (NOT RECOMMENDED)
  await page.waitForLoadState('networkidle')

  const text = await successButton.allTextContents
  expect(Text).toContain('Data loaded with AJAX get request.')


  })

test('auto waiting', async ({ page }) => {
  const successButton = page.locator('.bg-success')

  // await successButton.click()

  // const text = await successButton.textContent()
  // await successButton.waitFor({state: "attached"})
  // const text = await successButton.allTextContents()

  // expect(text).toContain('Data loaded with AJAX get request.')

  await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})


test('timeouts', async ({ page }) => {
  // test.setTimeout(10000)
  test.slow()
  const successButton = page.locator('.bg-success')
  await successButton.click()
})

