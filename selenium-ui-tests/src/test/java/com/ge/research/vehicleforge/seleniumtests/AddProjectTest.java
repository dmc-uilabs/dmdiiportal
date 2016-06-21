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

public class AddProjectTest extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 30);
	
	Integer projectNum =TestUtils.ran;
	String projectName = "Test Project " + projectNum;
	String overview = "This is a test for adding project" + projectNum;
	String ProjectTag = "Test tag" + projectNum;
	String overviewEdit = "This is a test for editing project" + projectNum;
	String ProjectTagEdit = "Test tag edited" + projectNum;

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
		testDMCLogin();
		
		accountProjectNav();
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		WebElement e = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("input_5")));
		e.clear();
		e.sendKeys(projectName);
		
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
	    driver.findElement(By.id("input_12")).sendKeys(overview);
	    //add tag
	    driver.findElement(By.id("input_13")).clear();
	    driver.findElement(By.id("input_13")).sendKeys(ProjectTag);
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
		// Invite members to this project
	    driver.findElement(By.xpath("//div[2]/dmc-add-members-card/div/div[5]/button")).click();
	    driver.findElement(By.xpath("//div[3]/dmc-add-members-card/div/div[5]/button")).click();
	    
	    //submit to create the new project
	    driver.findElement(By.xpath("//div[2]/button[2]")).click();
	}
	
	@Test
	public void editProjectTest() throws Exception{
		testDMCLogin();
		driver.get(baseUrl + "/my-projects.php#/");
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.linkText("Test Project65549")));
        element.click();
        
        /*driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    //driver.findElement(By.linkText(projectName)).click();
        driver.findElement(By.linkText("Test Project65549")).click();*/
	    driver.findElement(By.linkText("Edit")).click();
		
	    
	    driver.findElement(By.id("input_12")).clear();
	    driver.findElement(By.id("input_12")).sendKeys(overviewEdit);
	    //add tag
	    driver.findElement(By.id("input_13")).clear();
	    driver.findElement(By.id("input_13")).sendKeys(ProjectTagEdit);
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

	    //submit to create the new project
	    driver.findElement(By.xpath("//div[2]/button[2]")).click();
		
	}
	
	

	
}
