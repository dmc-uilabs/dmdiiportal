package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class DeleteTaskTest extends BaseTest{


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

	

}
