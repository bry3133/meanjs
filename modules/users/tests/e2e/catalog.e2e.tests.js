'use strict';

describe('Users E2E Tests:', function () {
  var user1 = {
    'lastName': 'Sponsor',
    'firstName': 'Microsoft',
    email: 'test@test.com',
    username: 'ryansponsor',
    password: 'Testpassword11!'
  };

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:8443/auth/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  describe('Signin Validation', function () {

    it('Should report missing credentials', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:8443/authentication/signin');
      var checkLabel = element(by.id('checkbox'));
      checkLabel.click();
      // Click Submit button
      element(by.id('submitbtn')).click();
      // Login Error
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8443/authentication/signin');
    });

    it('Verify that the user is logged in', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:8443/authentication/signin');
      // Enter UserName
      element(by.model('vm.credentials.usernameOrEmail')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      var checkLabel = element(by.id('checkbox'));
      checkLabel.click();
      // Click Submit button
      element(by.id('submitbtn')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8443/catalog');
    });

  });

  describe('Change Password Settings Validation', function () {

    it('Should report missing passwords', function () {
      browser.get('http://localhost:8443/settings/password');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Errors
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Your current password is required.');
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('Enter a new password.');
      expect(element.all(by.css('.error-text')).get(2).getText()).toBe('Verify your new password.');
    });

    it('Should report a password with less than 10 characters long - "P@$$w0rd!"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be at least 10 characters long.');
    });

    it('Should report a password with greater than 128 characters long.', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be fewer than 128 characters.');
    });

    it('Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rd!!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password may not contain sequences of three or more repeated characters.');
    });

    it('Should report a password with no uppercase letters - "p@$$w0rd!!"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('p@$$w0rd!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one uppercase letter.');
    });

    it('Should report a password with less than one number - "P@$$word!!"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$word!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one number.');
    });

    it('Should report a password with less than one special character - "Passw0rdss"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter Invalid Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('Passw0rdss');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one special character.');
    });

    it('Should report passwords do not match', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Errors
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Passwords do not match.');
    });

    it('Should change the password to - "P@$$w0rds!!"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys(user1.password);
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys('P@$$w0rds!!');
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys('P@$$w0rds!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Changed
      expect(element.all(by.css('.ui-notification')).get(0).getText()).toBe('Password Changed Successfully');
    });
    it('Should change the password to - "Testpassword11!"', function () {
      browser.get('http://localhost:8443/settings/password');
      // Enter Current Password
      element(by.model('vm.passwordDetails.currentPassword')).sendKeys('P@$$w0rds!!');
      // Enter New Password
      element(by.model('vm.passwordDetails.newPassword')).sendKeys(user1.password);
      // Verify New Password
      element(by.model('vm.passwordDetails.verifyPassword')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Changed
      expect(element.all(by.css('.ui-notification')).get(0).getText()).toBe('Password Changed Successfully');
    });
  });
  describe('Filter Functionality Validation', function () {
    it('Should select all filter checkboxes', function () {
      browser.get('http://localhost:8443/catalog');
      // Drop down filter options
      element.all(by.css('[id="sizing-addon2"]')).click();
      // Check all filter options
      expect(element.all(by.css('[id="availability"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="agricultural and biological engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="biological engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="business administration"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="biomedical engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="chemical engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="civil engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="computer and information science engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="computer engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="computer science - engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="computer science - liberal arts"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="digital arts and sciences"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="electrical and computer engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="electrical engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="environmental engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="environmental engineering science"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="engineering school for sustainable infrastructure and the environment"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="industrial and systems engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="materials science and engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="mechanical and aerospace engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="mechanical engineering"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="packaging sciences"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="sponsor"]')).isSelected()).toBeTruthy();
      expect(element.all(by.css('[id="student"]')).isSelected()).toBeTruthy();
    });
    it('Should show only Selena', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.css('[ng-model="searchValue"]')).sendKeys('Selena Gomez');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element.all(by.repeater('user in filteredUsersList')).then(function (user) {
        var titleElement = user[0].element(by.className('name'));
        expect(titleElement.getText()).toEqual('Selena Gomez');
      });
    });
    it('Should show only Digital Arts Majors', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.css('[ng-model="searchValue"]')).sendKeys('Digital Arts');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element.all(by.repeater('user in filteredUsersList')).then(function (user) {
        var titleElement = user[0].element(by.binding('user.major'));
        expect(titleElement.getText()).toEqual('Major: Digital Arts and Sciences');
      });
    });
    it('Should show only Available', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.css('[ng-model="searchValue"]')).sendKeys('Available');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      var titleElement = element(by.css('[id ="available"]'));
      expect(titleElement.getText()).toEqual('Employment Status: available');
    });
    it('Should show only Team The Jackson 6', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.css('[ng-model="searchValue"]')).sendKeys('The Jackson 6');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element.all(by.repeater('user in filteredUsersList')).then(function (user) {
        var titleElement = user[0].element(by.binding('user.teamName'));
        expect(titleElement.getText()).toEqual('Team: The Jackson 6');
      });
    });
  });

  describe('Cart Functionality Validation', function () {
    it('Add first element to Cart', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element(by.css('[id="addCart"]')).click();
      expect(element(by.css('[id="delete1Cart"]')).isDisplayed()).toBeTruthy();
    });
    it('Add third element to Cart', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.repeater('user in filteredUsersList').row(2)).click();
      element(by.css('[id="addCart"]')).click();
      expect(element(by.css('[id="delete1Cart"]')).isDisplayed()).toBeTruthy();
    });
    it('Add all element to Cart', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element(by.css('[id="addCart"]')).click();
      element(by.repeater('user in filteredUsersList').row(1)).click();
      element(by.css('[id="addCart"]')).click();
      element(by.repeater('user in filteredUsersList').row(2)).click();
      element(by.css('[id="addCart"]')).click();
      expect(element(by.css('[id="delete1Cart"]')).isDisplayed()).toBeTruthy();
    });
    it('Save 2 element to Cart', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element(by.css('[id="addCart"]')).click();
      element(by.repeater('user in filteredUsersList').row(1)).click();
      element(by.css('[id="addCart"]')).click();
      element(by.css('[ng-click = "toggleCartTable()"]')).click();
      expect(element(by.css('[id="delete1Cart"]')).isDisplayed()).toBeTruthy();
    });
    it('Delete 2 element to Cart', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element(by.css('[id="delete1Cart"]')).click();
      element(by.repeater('user in filteredUsersList').row(1)).click();
      element(by.css('[id="delete1Cart"]')).click();
      element(by.css('[ng-click = "toggleCartTable()"]')).click();
      expect(element(by.css('[id="addCart"]')).isDisplayed()).toBe(true);
    });
  });
  describe('Student Profile Button Validation', function () {
    it('Go to first students profile', function () {
      browser.get('http://localhost:8443/catalog');
      element(by.repeater('user in filteredUsersList').row(0)).click();
      element.all(by.css('[ng-click="goToStudentProfile()]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:8443/catalog');
    });
  });

});
