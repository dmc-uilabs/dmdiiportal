package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class TasksPageTest {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();

  @Before
  public void setUp() throws Exception {
    driver = new FirefoxDriver();
    baseUrl = "http://localhost/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void testTasksPage() throws Exception {
		
		String header = TestUtils.getHeader();  	  
    driver.get(baseUrl + "/project.php#/5/tasks");
    driver.findElement(By.xpath("//div/md-icon")).click();
    driver.findElement(By.xpath("//div/md-icon")).click();
    driver.findElement(By.cssSelector("th[name=\"Assigned To\"] > div.ng-binding.ng-scope")).click();
    driver.findElement(By.cssSelector("th[name=\"Assigned To\"] > div.ng-binding.ng-scope")).click();
    driver.findElement(By.xpath("//th[3]/div/md-icon")).click();
    driver.findElement(By.xpath("//th[3]/div/md-icon")).click();
    driver.findElement(By.cssSelector("th[name=\"Priority\"] > div.ng-binding.ng-scope")).click();
    driver.findElement(By.cssSelector("th[name=\"Priority\"] > div.ng-binding.ng-scope")).click();
    driver.findElement(By.cssSelector("#select_value_label_1 > span")).click();
    driver.findElement(By.cssSelector("#select_option_6 > div.md-text.ng-binding")).click();
    driver.findElement(By.cssSelector("#select_value_label_8 > span")).click();
    driver.findElement(By.cssSelector("#select_option_14 > div.md-text.ng-binding")).click();
  }

  @After
  public void tearDown() throws Exception {
    driver.quit();
    String verificationErrorString = verificationErrors.toString();
    if (!"".equals(verificationErrorString)) {
      fail(verificationErrorString);
    }
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  private boolean isAlertPresent() {
    try {
      driver.switchTo().alert();
      return true;
    } catch (NoAlertPresentException e) {
      return false;
    }
  }

  private String closeAlertAndGetItsText() {
    try {
      Alert alert = driver.switchTo().alert();
      String alertText = alert.getText();
      if (acceptNextAlert) {
        alert.accept();
      } else {
        alert.dismiss();
      }
      return alertText;
    } finally {
      acceptNextAlert = true;
    }
  }
}
