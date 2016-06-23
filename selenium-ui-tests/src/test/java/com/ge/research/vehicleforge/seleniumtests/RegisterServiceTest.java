package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RegisterServiceTest extends BaseTest{

	WebDriverWait wait = new WebDriverWait(driver, 30);
	int num = TestUtils.ran;
	private String serviceName = "AppliedLoad " + num;
	private String serviceDes = "This is the description for service AppliedLoad " + num;
	private String serviceTag = "alpha " + num;

	@Test
	public void testRegisterService() throws Exception{
		driver.get(baseUrl + "/project.php#/14/services");

		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    driver.findElement(By.linkText("REGISTER SERVICES")).click();
	    driver.findElement(By.xpath("//md-select")).click();
	    WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-option[16]/div")));
	    element.click();

	    //choose Alpha service to register
	    Thread.sleep(3000);
	    driver.findElement(By.xpath("//li/div")).click();
	    Thread.sleep(3000);
	    driver.findElement(By.xpath("//li/div")).click();
	    Thread.sleep(3000);
	    driver.findElement(By.xpath("//div[3]/button")).click();


	    //Edit content of REGISTER SERVICE page
	    driver.findElement(By.xpath("//md-input-container[2]/md-select")).click();
	    driver.findElement(By.xpath("//md-option[1]")).click();
	    driver.findElement(By.xpath("//input")).clear();
	    driver.findElement(By.xpath("//input")).sendKeys(serviceName);
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(serviceDes);
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).sendKeys(serviceTag);
	    Thread.sleep(1000);
	    driver.findElement(By.xpath("//md-content[2]/div/form/button")).click();
	    driver.findElement(By.xpath("//button[2]")).click();

	    assertEquals("Alpha", driver.findElement(By.linkText("Alpha")).getText());

	   /* driver.findElement(By.xpath("//div[2]/a/span")).click();
	    driver.findElement(By.xpath("//button[2]")).click();
	    assertEquals("Status: running", driver.findElement(By.xpath("//h3")).getText());
	    assertEquals("Last Run Status: success", driver.findElement(By.xpath("//h3[2]")).getText());*/
	  }


}
