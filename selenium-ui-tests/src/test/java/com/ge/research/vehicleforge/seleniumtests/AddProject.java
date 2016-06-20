package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProject extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 30);

	//Navigate from MyAccount Menu
	public void accountProjectNav() throws Exception{
		testPublicLoginProtection();
		
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("My Projects", driver.getTitle());
	}
	
	@Test
	public void testAddProject() throws Exception{
		driver.get(baseUrl);
		//testDMCLogin();
		Integer projectNum =TestUtils.ran;
		accountProjectNav();
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		WebElement e = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("input_5")));
		e.clear();
		e.sendKeys("Test Project" + projectNum);
		
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
	    driver.findElement(By.id("input_12")).sendKeys("This is a test for adding project"+ projectNum);
	    //add tag
	    driver.findElement(By.id("input_13")).clear();
	    driver.findElement(By.id("input_13")).sendKeys("Test tag" +projectNum);
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button"))).click();
	    //driver.findElement(By.xpath("//md-content[2]/div/form/button")).click();
	    
	    //next to add member
	    JavascriptExecutor jse = (JavascriptExecutor)driver;
		WebElement next = driver.findElement(By.xpath("//ap-tab-one/div/div[2]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		//System.out.println("NEXT is enable or disabled: " + next.isEnabled());
		if(next.isEnabled()){
			next.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button NEXT!!!");
		}

		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

	    driver.findElement(By.xpath("//div[2]/dmc-add-members-card/div/div[5]/button")).click();
	    driver.findElement(By.xpath("//div[3]/dmc-add-members-card/div/div[5]/button")).click();
	    driver.findElement(By.xpath("//div[2]/button[2]")).click();
	}

	
}
