package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProject extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 20);

	//Navigate from MyAccount Menu
	//@Test
	public void accountProjectNav() throws Exception{
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("My Projects", driver.getTitle());
	}
	
	@Test
	public void testAddProject() throws Exception{
		accountProjectNav();
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		WebElement e = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("input_5")));
		e.clear();
		e.sendKeys("Test Project 123");
		
		//select due date
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.findElement(By.xpath("//md-datepicker/button")).click();
		driver.findElement(By.xpath("//tbody[4]/tr[5]/td[3]/span")).click();
	    driver.findElement(By.id("input_7")).click();
	    driver.findElement(By.xpath("//tbody[4]/tr[4]/td[5]/span")).click();
	    //select type
	    driver.findElement(By.id("select_11")).click();
	    driver.findElement(By.xpath("//md-option/div[1]")).click();
	    //add overview
	    driver.findElement(By.id("input_12")).clear();
	    driver.findElement(By.id("input_12")).sendKeys("This is a test for adding project");
	    //add tag
	   /* driver.findElement(By.id("input_13")).clear();
	    driver.findElement(By.id("input_13")).sendKeys("Test");
	    driver.findElement(By.xpath("//md-content[2]/div/form/button")).click();
	    */
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    //next to add member
	    //driver.findElement(By.xpath("//div[2]/button")).click();.
	    WebElement next = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[2]/button")));
	    next.click();
	    driver.findElement(By.xpath("//div[2]/dmc-add-members-card/div/div[5]/button")).click();
	    driver.findElement(By.xpath("//div[3]/dmc-add-members-card/div/div[5]/button")).click();
	    //driver.findElement(By.xpath("//div[2]/button[2]")).click();
	}

	
}
