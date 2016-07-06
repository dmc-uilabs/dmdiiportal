package com.ge.research.vehicleforge.seleniumtests;


import static org.junit.Assert.*;

import java.util.logging.Level;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AccountTest extends BaseTest {
	private String firstName = "Thomas-changed";
	private String lastName = "Smith-changed";
	private String location = "Schenectady";
	private String timeZone = "(UTC -05:00) America/Atikokan";

	public void myAccount() throws Exception{

		driver.get(baseUrl+"/dashboard.php#/");
		Thread.sleep(2000);
		driver.findElement(By.xpath("//div[3]/md-menu/button")).sendKeys(Keys.ENTER);
		WebDriverWait wait = new WebDriverWait(driver, 30);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[1]/a/span")));
        element.click();
	    log.log(Level.INFO, "Get current title:" + driver.getTitle());
	    assertEquals("Manage Account", driver.getTitle());
	}


	//@Test
	public void testMyAccountBascis() throws Exception{
	    myAccount();

	    //edit firstName, lastName;
	    driver.findElement(By.id("editFirstName")).clear();
	    driver.findElement(By.id("editFirstName")).sendKeys(firstName);
	    driver.findElement(By.id("input_1")).clear();
	    driver.findElement(By.id("input_1")).sendKeys(lastName);

	    //edit location and time zone;
	    driver.findElement(By.id("input_4")).clear();
	    driver.findElement(By.id("input_4")).sendKeys(location);
	    driver.findElement(By.id("fl-input-5")).clear();
	    driver.findElement(By.id("fl-input-5")).sendKeys("UTC -05:00");
	    driver.findElement(By.xpath("//li/span")).click();

	    driver.findElement(By.xpath("//button[3]")).click();

	    //validate changed values
	    String firstNameChanged = driver.findElement(By.id("editFirstName")).getAttribute("value");
	    String lastNameChanged = driver.findElement(By.id("input_1")).getAttribute("value");
	    String locationChanged = driver.findElement(By.id("input_4")).getAttribute("value");
	    String timeZoneChanged = driver.findElement(By.id("fl-input-5")).getAttribute("value");

	    assertEquals(firstName, firstNameChanged);
	    assertEquals(lastName, lastNameChanged);
	    assertEquals(location, locationChanged);
	    assertEquals(timeZone, timeZoneChanged);

	}


	//@Test
	public void testMyAccountPrivacy() throws Exception{
		//navigate to PRIVACY tab
		driver.findElement(By.xpath("//md-list-item[2]/a/div/div")).click();

		// uncheck all public information
	    driver.findElement(By.xpath("//md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[3]/md-checkbox/div")).click();

	    //uncheck all private information
	    driver.findElement(By.xpath("//md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[3]/md-checkbox/div")).click();

	    //check all public information
	    driver.findElement(By.xpath("//div[2]/div/div/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[3]/md-checkbox/div")).click();

	    // check all private information
	    driver.findElement(By.xpath("//div[2]/div/div/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[2]/md-checkbox/div")).click();
	    driver.findElement(By.xpath("//div[2]/div/div[3]/md-checkbox/div")).click();

	    //save changes
	    driver.findElement(By.xpath("//button[2]")).click();
	}


	//@Test
	public void testMyAccountNotification() throws Exception{
		//navigate to NOTIFICATIONS tab
		driver.findElement(By.xpath("//md-list-item[3]/a/div/div")).click();
		//navigate to EMAIL sub-tab
		driver.findElement(By.xpath("//md-tab-item[2]/span")).click();
		assertEquals("EMAIL", driver.findElement(By.xpath("//md-tab-item[2]/span")).getText());
		//navigate to WEBSITE sub-tab
	    driver.findElement(By.xpath("//md-tab-item/span")).click();
	    assertEquals("WEBSITE", driver.findElement(By.xpath("//md-tab-item")).getText());

	    //deactivate all and activate all again and save changes
	    driver.findElement(By.xpath("//md-tab-content/div/md-content/div/button")).click();
	    driver.findElement(By.xpath("//md-tab-content/div/md-content/div/button[2]")).click();
	    driver.findElement(By.xpath("//button[2]")).click();

	    //activate all and deactivate all and save changes
	    driver.findElement(By.xpath("//md-tab-item[2]/span")).click();
	    assertEquals("EMAIL", driver.findElement(By.xpath("//md-tab-item[2]/span")).getText());
	    driver.findElement(By.xpath("//md-tab-content[2]/div/md-content/div/button[2]")).click();
	    driver.findElement(By.xpath("//button[2]")).click();
	    driver.findElement(By.xpath("//md-tab-content[2]/div/md-content/div/button")).click();
	    driver.findElement(By.xpath("//button[2]")).click();

	    //activate all marketplace notifications and save changes
	    driver.findElement(By.xpath("//md-tab-content[2]/div/md-content/div[2]/div[2]/div/md-switch/div/div[2]/div")).click();
	    driver.findElement(By.xpath("//md-tab-content[2]/div/md-content/div[2]/div[2]/div[2]/md-switch/div/div[2]/div")).click();
	    driver.findElement(By.xpath("//md-tab-content[2]/div/md-content/div[2]/div[2]/div[3]/md-switch/div/div[2]/div")).click();
	    driver.findElement(By.xpath("//md-tab-content[2]/div/md-content/div[2]/div[2]/div[4]/md-switch/div/div[2]/div")).click();
	    driver.findElement(By.xpath("//button[2]")).click();


	}



	//@Test
	public void testMyAccountServer() throws Exception{
		//navigate to SERVERS tab
		driver.findElement(By.xpath("//md-list-item[4]/a/div/div")).click();

		//add server//add server
		WebDriverWait wait1 = new WebDriverWait(driver, 20);
		WebElement element1 = wait1.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content/div[1]/button")));
        element1.click();

        //server info
        driver.findElement(By.xpath("//div[2]/md-input-container/input")).clear();
        driver.findElement(By.xpath("//div[2]/md-input-container/input")).sendKeys("Add server for testing0000");
        driver.findElement(By.xpath("//md-input-container[2]/input")).clear();
        driver.findElement(By.xpath("//md-input-container[2]/input")).sendKeys("Fake server IP");
        driver.findElement(By.xpath("//button[2]")).click();


	    //click add server button and cancel adding server
	   // driver.findElement(By.xpath("//md-content/div[1]/button")).click();
	    driver.findElement(By.xpath("//div[2]/button[1]")).click();

	    //rename the server alias and URL
	    driver.findElement(By.xpath("//td/button")).click();
	    driver.findElement(By.xpath("//td[2]/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//td[2]/md-input-container/input")).sendKeys("Add server for testing0000 rename");
	    driver.findElement(By.xpath("//td[3]/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//td[3]/md-input-container/input")).sendKeys("Fake server IP rename");
	    driver.findElement(By.xpath("//td[4]/button")).click();

	    assertEquals("Add server for testing0000 rename", driver.findElement(By.xpath("//td[2]/md-input-container/input")).getAttribute("value"));
	    assertEquals("Fake server IP rename", driver.findElement(By.xpath("//td[3]/md-input-container/input")).getAttribute("value"));

	    //delete but not work currently
	    driver.findElement(By.xpath("//td[5]/button")).click();

	}


	//To make test case run in order.
	//@Ignore
	@Test
	public void testMyAccount() throws Exception{
		//testDMCLogin();
		testMyAccountBascis();
		//These two feature not implemented yet.
		//testMyAccountPrivacy();
		//testMyAccountNotification();
		testMyAccountServer();
	}

}
