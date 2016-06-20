package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


@SuppressWarnings("unused")
public class IndividualDiscussionTest extends BaseTest{
	
	



	@Test
	public void testIndividualDiscussion() throws Exception {
		this.setUp();
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/my-projects.php#/");
		driver.findElement(By.xpath("(//a[contains(text(),'View All (6)')])[2]")).click();
		driver.findElement(By.linkText("Flag")).click();
		driver.findElement(By.id("select_5")).click();
		driver.findElement(By.id("select_option_4")).click();
		driver.findElement(By.id("input_6")).clear();
		driver.findElement(By.id("input_6")).sendKeys(header + "test");
		// ERROR: Caught exception [Error: Dom locators are not implemented yet!]
		driver.findElement(By.linkText("Reply")).click();
		driver.findElement(By.id("input_7")).clear();
		driver.findElement(By.id("input_7")).sendKeys(header + "test reply");
		// ERROR: Caught exception [Error: Dom locators are not implemented yet!]
		driver.findElement(By.xpath("//div[2]/button")).click();
		driver.findElement(By.xpath("//div[3]/button[2]")).click();
		driver.findElement(By.id("input_2")).clear();
		driver.findElement(By.id("input_2")).sendKeys(header + "test new comment");
		// ERROR: Caught exception [Error: Dom locators are not implemented yet!]
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div/button")).click();
	}


}
