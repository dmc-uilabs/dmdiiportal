package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class NewDiscussionFromProjectsPageTest {
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
	public void testNewDiscussionFromProjectsPage() throws Exception {
		
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/project.php#/5/home");
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.id("subject-compose-discussion")).clear();
		driver.findElement(By.id("subject-compose-discussion")).sendKeys(header + "Testing new discussion from project page");
		driver.findElement(By.id("input_11")).clear();
		driver.findElement(By.id("input_11")).sendKeys(header + "This is for selenium");
		driver.findElement(By.id("input_12")).clear();
		driver.findElement(By.id("input_12")).sendKeys(header + "selenium");
		driver.findElement(By.xpath("//md-dialog[@id='dialog_13']/div/div/div[2]/div/form/button")).click();
		driver.findElement(By.xpath("//md-dialog[@id='dialog_13']/div/div[2]/button[2]")).click();
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
