describe('ToolBox Home', () => {
  it('Visits the app root url and sees tool categories', () => {
    cy.visit('/')
    cy.contains('日常工具')
    cy.contains('开发工具')
    cy.contains('计算器')
  })

  it('Navigates to a tool and back', () => {
    cy.visit('/')
    cy.contains('计算器').click()
    cy.contains('AC')
    cy.get('ion-back-button').click()
    cy.contains('日常工具')
  })
})
