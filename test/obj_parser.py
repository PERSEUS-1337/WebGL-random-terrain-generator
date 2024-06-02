import re
import random
def parse_obj_file(file_path):
    vertices = []
    normals = []
    indices = []

    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('v '):  # Vertex coordinates
                parts = line.strip().split()
                vertex = [float(parts[1]), random.uniform(0,1), float(parts[3])]
                vertices.extend(vertex)
            elif line.startswith('vn '):  # Vertex normals
                parts = line.strip().split()
                normal = [float(parts[1]), float(parts[2]), float(parts[3])]
                normals.extend(normal)
            elif line.startswith('f '):  # Face
                parts = line.strip().split()
                face = []
                for part in parts[1:]:
                    # Match "vertex/texture/normal" or "vertex//normal"
                    matches = re.match(r'(\d+)//?(\d*)/?(\d*)', part)
                    vertex_index = int(matches.group(1)) - 1
                    # We ignore texture and normal indices in this example
                    face.append(vertex_index)
                indices.extend(face)

    return vertices, normals, indices
def write_to_file(vertices, normals, indices, output_path):
    with open(output_path, 'w') as file:
        file.write("Vertices:\n")
        file.write(",".join(map(str, vertices)) + "\n")

        file.write("\nNormals:\n")
        file.write(",".join(map(str, normals)) + "\n")

        file.write("\nIndices:\n")
        file.write(",".join(map(str, indices)) + "\n")

def main():
    file_path = './blank.obj'  # Replace with your OBJ file path
    output_file_path = "output.txt"
    vertices, normals, indices = parse_obj_file(file_path)
    write_to_file(vertices, normals, indices, output_file_path)
    print("Vertices:")
    for vertex in vertices:
        print(vertex)
    
    print("\nNormals:")
    for normal in normals:
        print(normal)
    
    print("\nIndices:")
    print(indices)

if __name__ == "__main__":
    main()