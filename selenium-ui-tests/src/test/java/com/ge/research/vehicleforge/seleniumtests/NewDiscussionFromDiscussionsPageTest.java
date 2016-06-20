package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class NewDiscussionFromDiscussionsPageTest extends BaseTest{
	private WebDriver driver;
	private String baseUrl;
	private boolean acceptNextAlert = true;
	private StringBuffer verificationErrors = new StringBuffer();


	@Test
	public void testNewDiscussion() throws Exception {
		
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/project.php#/1/discussions");
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.id("subject-compose-discussion")).clear();
		driver.findElement(By.id("subject-compose-discussion")).sendKeys(header + "Adding a test for selenium");
		driver.findElement(By.id("input_9")).clear();
		driver.findElement(By.id("input_9")).sendKeys(header + "This is a new discussion for testing in selenium");
		driver.findElement(By.id("input_10")).clear();
		driver.findElement(By.id("input_10")).sendKeys(header + "Test for selenium");
		driver.findElement(By.xpath("//md-dialog[@id='dialog_11']/div/div/div[2]/div/form/button")).click();
		driver.findElement(By.xpath("//md-dialog[@id='dialog_11']/div/div[2]/button[2]")).click();
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div[2]/button")).click();
		driver.findElement(By.linkText("Reply")).click();
		driver.findElement(By.id("input_3")).clear();
		driver.findElement(By.id("input_3")).sendKeys(header + "this tests the comment reply feature");
		// ERROR: Caught exception [Error: Dom locators are not implemented yet!]
		driver.findElement(By.xpath("//div[3]/button[2]")).click();
		driver.findElement(By.id("input_2")).clear();
		driver.findElement(By.id("input_2")).sendKeys(header + "this tests the new comment feature");
		// ERROR: Caught exception [Error: Dom locators are not implemented yet!]
	}

	
}
