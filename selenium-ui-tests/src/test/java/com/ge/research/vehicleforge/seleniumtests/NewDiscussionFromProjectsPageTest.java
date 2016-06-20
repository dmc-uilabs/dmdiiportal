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



	@Test
	public void testNewDiscussionFromProjectsPage() throws Exception {
		String header = TestUtils.getHeader();
		driver.get(baseUrl + "/project.php#/1/home");
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div/md-input-container/input")).clear();
		driver.findElement(By.xpath("//div/md-input-container/input")).sendKeys("testing discussion from projects page");
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys("running a selenium test");
		driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).clear();
		driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).sendKeys("selenium test");
		driver.findElement(By.xpath("//div[2]/div/form/button")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.linkText("Reply")).click();
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys("test the reply feature");
		driver.findElement(By.xpath("//form/div/div/button[2]")).click();
		driver.findElement(By.linkText("Flag")).click();
		driver.findElement(By.xpath("//md-select")).click();
		driver.findElement(By.xpath("//md-option")).click();
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys("test the flagging feature");
		driver.findElement(By.xpath("//form/div/div/button[2]")).click();
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys("test the commenting feature");
		driver.findElement(By.xpath("//form/div/button")).click();
		driver.findElement(By.xpath("//button[2]")).click();
		driver.findElement(By.xpath("//div[3]/button")).click();
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div/button")).click();




	}
}
