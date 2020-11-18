context('Login', () => {
    it('login', () => {
        localStorage.clear()
        cy.visit('http://localhost:3001')
        cy.get(".tologin").click()
        cy.get(".inputusername").type("test")
        cy.get(".inputpassword").type("test")
        cy.get(".loginbutton").click()
        cy.get('.tologin').should('not.exist');
    })
})