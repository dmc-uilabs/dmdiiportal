package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class TaskEditTest extends BaseTest {
	
	@Test
	public void testTaskEdit() throws Exception {
		
		String header = TestUtils.getHeader();  	  
		driver.get(baseUrl + "/project.php#/5/tasks");
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.id("input_6")).clear();
		driver.findElement(By.id("input_6")).sendKeys(header + "test task edit");
		driver.findElement(By.id("input_7")).clear();
		driver.findElement(By.id("input_7")).sendKeys(header + "for selenium");
		driver.findElement(By.xpath("(//button[@type='button'])[8]")).click();
		driver.findElement(By.cssSelector("#md-0-2016-6-31 > span.md-calendar-date-selection-indicator")).click();
		driver.findElement(By.id("select_10")).click();
		driver.findElement(By.cssSelector("#select_option_14 > div.md-text.ng-binding")).click();
		driver.findElement(By.id("select_12")).click();
		driver.findElement(By.cssSelector("div.md-text.ng-binding")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.xpath("//div[2]/button")).click();
		driver.findElement(By.id("input_16")).clear();
		driver.findElement(By.id("input_16")).sendKeys(header + "this is a selenium test");
		driver.findElement(By.id("input_15")).clear();
		driver.findElement(By.id("input_15")).sendKeys(header + "task has been edited for selenium");
		driver.findElement(By.xpath("(//button[@type='button'])[8]")).click();
		driver.findElement(By.id("md-0-2016-6-19")).click();
		driver.findElement(By.cssSelector("#select_value_label_1 > span")).click();
		driver.findElement(By.id("select_option_10")).click();
		driver.findElement(By.cssSelector("#select_value_label_2 > span")).click();
		driver.findElement(By.cssSelector("#select_option_13 > div.md-text.ng-binding")).click();
		driver.findElement(By.xpath("//button[4]")).click();
	}

	
}
