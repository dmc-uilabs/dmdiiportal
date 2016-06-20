package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class TasksPageTest extends BaseTest {
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();

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

  
}
