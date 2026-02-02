
import zipfile
import os

def create_backup(zip_name):
    # Files/Dirs to exclude
    excludes = {
        'Essence_Automations_Backup.zip',
        'Essence_Automations_v1.0.32.zip',
        '.git',
        '.agent'
    }

    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in excludes]
            
            for file in files:
                if file in excludes:
                    continue
                
                # Check absolute path avoidance if needed, but for now simple name check is mostly enough
                # except for excludes which might be in root
                
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                
                # Double check against excludes for files in root
                if arcname in excludes:
                    continue
                    
                zipf.write(file_path, arcname)

    print(f"Created {zip_name}")

if __name__ == "__main__":
    create_backup('Essence_Automations_Backup.zip')
    create_backup('Essence_Automations_v1.0.32.zip')
