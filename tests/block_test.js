const {Builder, By, Key} = require('selenium-webdriver');

var email = "script@test.com";
var password = "123";


(async function match_test() {
    let driver = await new Builder().forBrowser('chrome').build();

    //log in

    await driver.get('https://doggos.herokuapp.com/login');

    await driver.findElement(By.name('email')).sendKeys(email, Key.TAB);

    await driver.findElement(By.name('password')).sendKeys(password, Key.ENTER);

    //go to matches page

    await driver.get('https://doggos.herokuapp.com/explore');

    //get the name of the first match

    let all_matches = await driver.findElements(By.css('li'));

    var name = await all_matches[5].getText();

    var temp_name = name.split('\n');

    var accepted_match_full_name = temp_name[0].slice(5);

    accepted_match_full_name = accepted_match_full_name.split(',');

    console.log(accepted_match_full_name);

    // block the first match on the page

    let blockButton = await driver.findElements(By.css('button'));

    const actions = driver.actions({async: true});

    await actions.move({origin:blockButton[1]}).press().perform();

    await actions.move({origin:blockButton[1]}).release().perform();

    //go to blocked page and verify that the blocked user is there

    await driver.get('https://doggos.herokuapp.com/blocked');

    let blocked_users = await driver.findElements(By.css('li'));

    var blocked_located = false;

    for (var i = 5; i < blocked_users.length; i++){
        var blocked_name = await blocked_users[i].getText();

        var temp_blocked_name = blocked_name.split('\n');
        var blocked_full_name = temp_blocked_name[0].slice(5);

        blocked_full_name = blocked_full_name.split(',');


        if (blocked_full_name[0].trim() == accepted_match_full_name[0].trim() && blocked_full_name[1].trim() == accepted_match_full_name[1].trim()){
            console.log('in here');
            blocked_located = true;
        }
    }

    if (blocked_located){
        console.log("Blocked User has been found");
    }else{
        console.log("Didn't find the blocked user");
    }

    driver.quit();
})();