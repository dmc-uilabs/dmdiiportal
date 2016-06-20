package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class DeleteTaskTest {
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
	public void testDeleteTask() throws Exception {
		
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/project.php#/5/home");
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.id("input_6")).clear();
		driver.findElement(By.id("input_6")).sendKeys(header + "testing delete functionality");
		driver.findElement(By.id("input_7")).clear();
		driver.findElement(By.id("input_7")).sendKeys(header + "for selenium");
		driver.findElement(By.xpath("(//button[@type='button'])[8]")).click();
		driver.findElement(By.cssSelector("#md-0-2016-6-1 > span.md-calendar-date-selection-indicator")).click();
		driver.findElement(By.id("select_10")).click();
		driver.findElement(By.id("select_option_13")).click();
		driver.findElement(By.id("select_12")).click();
		driver.findElement(By.cssSelector("#select_option_28 > div.md-text.ng-binding")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.xpath("//md-dialog/div/button[2]")).click();
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
