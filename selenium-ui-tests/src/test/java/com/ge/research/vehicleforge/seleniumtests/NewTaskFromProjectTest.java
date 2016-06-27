package com.ge.research.vehicleforge.seleniumtests;

import java.util.regex.Pattern;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

public class NewTaskFromProjectTest extends BaseTest {
	
	@Ignore
	@Test
	public void testNewTaskFromProject() throws Exception {
		
		String header = TestUtils.getHeader();  
		
		// This is the SVG xpath I need to use. 
		// /html/body/div[2]/ui-view/div[2]/div/div[1]/div[3]/div[1]/md-toolbar/div/a[1]/ng-md-icon/svg

		driver.get(baseUrl + "/project.php#/5/home");
		driver.findElement(By.xpath("//html/body/div[2]/ui-view/div[2]/div/div[1]/div[3]/div[1]/md-toolbar/div/a[1]/ng-md-icon/svg")).click();
		// ERROR: Caught exception [Error: locator strategy either id or name must be specified explicitly.]
		driver.findElement(By.id("input_6")).clear();
		driver.findElement(By.id("input_6")).sendKeys(header + "testing task from projects page for selenium");
		driver.findElement(By.id("input_7")).clear();
		driver.findElement(By.id("input_7")).sendKeys(header + "selenium test");
		driver.findElement(By.xpath("(//button[@type='button'])[7]")).click();
		driver.findElement(By.xpath("(//button[@type='button'])[8]")).click();
		driver.findElement(By.cssSelector("#md-0-2016-5-30 > span.md-calendar-date-selection-indicator")).click();
		driver.findElement(By.id("select_10")).click();
		driver.findElement(By.cssSelector("#select_option_14 > div.md-text.ng-binding")).click();
		driver.findElement(By.id("select_12")).click();
		driver.findElement(By.cssSelector("div.md-text.ng-binding")).click();
		driver.findElement(By.xpath("//button[2]")).click();
	}

	
}
