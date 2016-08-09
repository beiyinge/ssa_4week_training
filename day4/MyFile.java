import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.Charset;

public class MyFile {

	private static String fileName ="c:\\temp\\test.html";
	
	private static String fileNameNew ="c:\\temp\\testNew.html";
	
	
	List<String> strList=new ArrayList();
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		try{
			String currentLocation = new java.io.File(".").getCanonicalPath();
			System.out.println("current location " + currentLocation);
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		MyFile ff = new MyFile();
		
		//ff.readFile();
		ff.readAFileOneLineAtTime();
		
		try {
			ff.writeToFile(fileNameNew);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			
			e.printStackTrace();
		}

	}

	void MyFile (){
		
	}
	//read file
	public void readFile (){
		
	    
		Path wiki_path = Paths.get(fileName);

	    Charset charset = Charset.forName("ISO-8859-1");
	    try {
	      List<String> lines = Files.readAllLines(wiki_path, charset);

	      for (String line : lines) {
	        System.out.println(line);
	        
	        
	            }
	    } catch (IOException e) {
	      System.out.println(e);
	    }

	
   }
		
    //read words.txt
    //sort alphabetically
    //write to a new file
	//do not use .readAllLines
	public void writeToFile (String newFileName) throws Exception {
		Collections.sort(strList);
		

		File file = new File(newFileName);

		// if file doesnt exists, then create it
		if (!file.exists()) {
			file.createNewFile();
		}
		
		FileWriter fw = new FileWriter(file.getAbsoluteFile());
		BufferedWriter bw = new BufferedWriter(fw);
		
		for ( String strTemp : strList) {
			System.out.print("\n"+strTemp);
			bw.write(strTemp + System.lineSeparator());
		}
		

		
		bw.close();

	}
	
	public void readAFileOneLineAtTime() {
	
		// This will reference one line at a time
        String line = null;

        try {
            // FileReader reads text files in the default encoding.
            FileReader fileReader = 
                new FileReader(fileName);

            // Always wrap FileReader in BufferedReader.
            BufferedReader bufferedReader = 
                new BufferedReader(fileReader);

            while((line = bufferedReader.readLine()) != null) {
                System.out.println(line);
                strList.add(line);
            }   

            // Always close files.
            bufferedReader.close();         
        }
        catch(FileNotFoundException ex) {
            System.out.println(
                "Unable to open file '" + 
                fileName + "'");                
        }
        catch(IOException ex) {
            System.out.println(
                "Error reading file '" 
                + fileName + "'");                  
            // Or we could just do this: 
            // ex.printStackTrace();
        }
    }
	
	public void upperWriteFile(String newFileName) throws IOException{
Collections.sort(strList);
		

		File file = new File(newFileName);

		// if file doesnt exists, then create it
		if (!file.exists()) {
			file.createNewFile();
		}
		
		FileWriter fw = new FileWriter(file.getAbsoluteFile());
		BufferedWriter bw = new BufferedWriter(fw);
		
		for ( String strTemp : strList) {
			System.out.print("\n"+strTemp);
			bw.write(strTemp.toUpperCase() + System.lineSeparator());
		}
		

		
		bw.close();

	}
}


