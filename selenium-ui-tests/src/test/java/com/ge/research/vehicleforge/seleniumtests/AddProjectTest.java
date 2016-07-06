package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.junit.Test;
import org.junit.Ignore;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProjectTest extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 30);
	private static Logger LOGGER = Logger.getLogger("InfoLogging");
	
	Integer projectNum =TestUtils.ran;
	String projectName = "Test Project " + projectNum;
	String overview = "This is a test for adding project" + projectNum;
	String ProjectTag = "Test tag" + projectNum;
	String overviewEdit = "This is a test for editing project" + projectNum;
	String ProjectTagEdit = "Test tag edited" + projectNum;
	JavascriptExecutor jse = (JavascriptExecutor)driver;

	//Navigate from MyAccount Menu
	public void accountProjectNav() throws Exception{
		//testPublicLoginProtection();
		
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span")));
        element.click();	    
        log.log(Level.INFO, "Get current title:" + driver.getTitle());
	    assertEquals("My Projects", driver.getTitle());
	}
	
	//@Ignore
	//@Test
	public void testAddProject() throws Exception{
		testDMCLogin();
		driver.get(baseUrl + "/my-projects.php#/");
		Thread.sleep(1000);
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		WebElement e = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//md-content/form/md-input-container/input")));
		e.clear();
		e.sendKeys(projectName);
		
		//select due date
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.findElement(By.xpath("//md-datepicker/button")).click();
		
		String[] currentDate = (new SimpleDateFormat("yyyy-MM-dd")).format(new Date()).split("-");
		String regex = "^0*";
		currentDate[1] = currentDate[1].matches(regex) ? currentDate[1].substring(1) : currentDate[1];
		String substitutedDate = currentDate[0] + "-" + currentDate[1] + "-" + currentDate[2];
		log.log(Level.INFO, "addProjectTest, xpath is " + "//td[@id='md-0-"+ substitutedDate + "']/span");
		
		driver.findElement(By.xpath("//tbody[4]/tr[5]/td[3]/span")).click();
	    
		/*driver.findElement(By.xpath("//div/button")).click();
	    driver.findElement(By.xpath("//tbody[4]/tr[5]/td[3]/span")).click();*/
	    
	    //select private type
	    driver.findElement(By.xpath("//md-input-container[2]/md-select")).click();
	    driver.findElement(By.xpath("//md-option[2]/div")).click();
	    
	    //add overview
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(overview);
	    
	    //add tag
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).sendKeys(ProjectTag);
	    Thread.sleep(3000);
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button"))).sendKeys(Keys.ENTER);;
	    
	    //next to add member
		WebElement next = driver.findElement(By.xpath("//ap-tab-one/div/div[2]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		if(next.isEnabled()){
			next.sendKeys(Keys.ENTER);;
		}else{
			LOGGER.info("The button NEXT is not clickable!");
		}

		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		
		// Invite members to this project
	    /*driver.findElement(By.xpath("//div[2]/dmc-add-members-card/div/div[5]/button")).click();
	    driver.findElement(By.xpath("//div[3]/dmc-add-members-card/div/div[5]/button")).click();*/
	    
		//submit to create the new project
				WebElement submit = driver.findElement(By.xpath("//div[2]/button[2]"));
				jse.executeScript("arguments[0].scrollIntoView(true);", submit);
				if(next.isEnabled()){
					next.sendKeys(Keys.ENTER);;
				}else{
					log.log(Level.INFO,"The button submit is not clickable!");
				}
	}
	
	//@Ignore
	//@Test
	public void editProjectTest() throws Exception{
		driver.get(baseUrl + "/my-projects.php#/");
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.linkText(projectName)));
		//WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.linkText("Test Project65549")));
        element.click();
        
	    driver.findElement(By.linkText("Edit")).click();
	    driver.findElement(By.xpath("//textarea")).clear();
	    driver.findElement(By.xpath("//textarea")).sendKeys(overviewEdit);
	    
	    //add tag
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).sendKeys(ProjectTagEdit);
	    Thread.sleep(1000);
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button"))).click();
	    
	    
	    //next to add member
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
		WebElement submit = driver.findElement(By.xpath("//div[2]/button[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", submit);
		if(next.isEnabled()){
			next.sendKeys(Keys.ENTER);;
		}else{
			log.log(Level.INFO,"The button submit is not clickable!");
		}
		
	}
	
	@Test
	public void ProjectTest() throws Exception{
		testAddProject();
		//editProjectTest()
	}
	

	
}
