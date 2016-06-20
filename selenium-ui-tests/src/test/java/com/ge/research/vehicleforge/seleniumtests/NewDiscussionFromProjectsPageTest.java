package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class NewDiscussionFromProjectsPageTest extends BaseTest{
  private WebDriver driver;
  private String baseUrl;
  private boolean acceptNextAlert = true;
  private StringBuffer verificationErrors = new StringBuffer();



  @Test
  public void testNewDiscussionFromProjectsPage() throws Exception {
	  String header = TestUtils.getHeader();
    driver.get(baseUrl + "/project.php#/5/home");
    driver.findElement(By.xpath("//div/button")).click();
    driver.findElement(By.xpath("//div/button")).click();
    driver.findElement(By.id("subject-compose-discussion")).clear();
    driver.findElement(By.id("subject-compose-discussion")).sendKeys(header + "selenium test from projects page");
    driver.findElement(By.xpath("//md-dialog[@id='dialog_10']/div/div/div/div/div/md-content/md-input-container/textarea")).clear();
    driver.findElement(By.xpath("//md-dialog[@id='dialog_10']/div/div/div/div/div/md-content/md-input-container/textarea")).sendKeys(header + "selenium test from projects page comment");
    driver.findElement(By.xpath("//md-dialog[@id='dialog_10']/div/div/div[2]/div/form/md-input-container/input")).clear();
    driver.findElement(By.xpath("//md-dialog[@id='dialog_10']/div/div/div[2]/div/form/md-input-container/input")).sendKeys(header + "selenium test from projects page tag");
    driver.findElement(By.xpath("//md-dialog[@id='dialog_10']/div/div/div[2]/div/form/button")).click();
    driver.findElement(By.xpath("//md-dialog[@id='dialog_10']/div/div[2]/button[2]")).click();
  }

  

  
}
